function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatHHmm(date) {
  if (!date) return null;
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function isDelayed(expected, scheduled) {
  const expectedDate = parseDate(expected);
  const scheduledDate = parseDate(scheduled);
  if (!expectedDate || !scheduledDate) return false;
  return expectedDate.getTime() > scheduledDate.getTime();
}

function formatDuration(totalMinutes) {
  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) return null;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function firstNonWalkLeg(legs) {
  return legs.find((leg) => leg?.mode && leg.mode !== "WALK") || null;
}

function lastNonWalkLeg(legs) {
  for (let i = legs.length - 1; i >= 0; i -= 1) {
    const leg = legs[i];
    if (leg?.mode && leg.mode !== "WALK") return leg;
  }
  return null;
}

function mapJourneyCard(journey) {
  const legs = Array.isArray(journey?.legs) ? journey.legs : [];
  const originCrs = journey?.origin || null;
  const destinationCrs = journey?.destination || null;

  const scheduledDeparture = journey?.scheduledTime?.departure || null;
  const expectedDeparture = journey?.realTime?.departure || null;
  const scheduledArrival = journey?.scheduledTime?.arrival || null;
  const expectedArrival = journey?.realTime?.arrival || null;

  const stdDate = parseDate(scheduledDeparture);
  const staDate = parseDate(scheduledArrival);
  const etdDate = parseDate(expectedDeparture);
  const etaDate = parseDate(expectedArrival);

  const activeDepartureDate = etdDate || stdDate;
  const activeArrivalDate = etaDate || staDate;

  const durationMinutes =
    activeDepartureDate && activeArrivalDate
      ? Math.max(
          0,
          Math.round((activeArrivalDate.getTime() - activeDepartureDate.getTime()) / 60000)
        )
      : null;

  const trainLegs = legs.filter((leg) => leg?.mode === "TRAIN");
  const changes = Math.max(trainLegs.length - 1, 0);

  const firstTransportLeg = firstNonWalkLeg(legs);
  const lastTransportLeg = lastNonWalkLeg(legs);

  return {
    id: journey?.id ?? null,
    title: `${originCrs || "?"} -> ${destinationCrs || "?"}`,
    origin: originCrs,
    destination: destinationCrs,
    times: {
      originSTD: formatHHmm(stdDate),
      originETD: formatHHmm(etdDate),
      destinationSTA: formatHHmm(staDate),
      destinationETA: formatHHmm(etaDate),
      originDelayed: isDelayed(expectedDeparture, scheduledDeparture),
      destinationDelayed: isDelayed(expectedArrival, scheduledArrival),
    },
    platforms: {
      originPlatform: firstTransportLeg?.originPlatform ?? null,
      destinationPlatform: lastTransportLeg?.destinationPlatform ?? null,
    },
    changes,
    duration: {
      minutes: durationMinutes,
      label: durationMinutes === null ? null : formatDuration(durationMinutes),
    },
    legs,
  };
}

exports.handler = async function (event) {
  try {
    const method = event.httpMethod || event.requestContext?.httpMethod || "GET";

    if (method !== "GET") {
      return {
        statusCode: 405,
        headers: {
          "Content-Type": "application/json",
          Allow: "GET",
        },
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const params = event.queryStringParameters || {};

    const origin = params.origin;
    const destination = params.destination;
    const outwardTime = params.outwardTime;

    if (!origin || !destination || !outwardTime) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Missing required query parameters",
          required: ["origin", "destination", "outwardTime"],
        }),
      };
    }

    const upstreamUrl = process.env.JOURNEY_PLAN_URL;
    const accessToken = process.env.JOURNEY_PLAN_ACCESS_TOKEN;
    const brandId = process.env.JOURNEY_PLAN_BRAND_ID || "southeastern";

    if (!upstreamUrl || !accessToken) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Journey plan upstream configuration is missing",
          missing: [
            !upstreamUrl ? "JOURNEY_PLAN_URL" : null,
            !accessToken ? "JOURNEY_PLAN_ACCESS_TOKEN" : null,
          ].filter(Boolean),
        }),
      };
    }

    // Ensure outwardTime is not in the past; if it is, clamp to "now"
    let effectiveOutwardTime = outwardTime;
    try {
      const requested = new Date(outwardTime);
      const now = new Date();
      if (!Number.isNaN(requested.getTime()) && requested < now) {
        effectiveOutwardTime = now.toISOString();
      }
    } catch {
      // If parsing fails, just pass through the original outwardTime
      effectiveOutwardTime = outwardTime;
    }

    const payload = {
      origin,
      destination,
      directTrains: false,
      realtimeEnquiry: "STANDARD",
      outwardTime: effectiveOutwardTime,
      includeAdditionalInformation: false,
    };

    const response = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        "x-access-token": accessToken,
        "x-brand-id": brandId,
      },
      body: JSON.stringify(payload),
    });

    const rawBody = await response.text();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          "Content-Type": response.headers.get("content-type") || "application/json",
        },
        body: rawBody,
      };
    }

    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (e) {
      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Invalid JSON from journey plan upstream",
        }),
      };
    }

    const outwardJourney = Array.isArray(data.outwardJourney) ? data.outwardJourney : [];

    const simplifiedJourneys = outwardJourney.map((journey) => {
      const legs = journey?.journeySequence?.legs || [];

      return {
        id: journey.id,
        origin: journey.origin,
        destination: journey.destination,
        scheduledTime: journey.scheduledTime || null,
        realTime: journey.realTime || null,
        legs: legs.map((leg) => ({
          id: leg.id,
          mode: leg.mode,
          realtimeClassification: leg.realtimeClassification,
          board: {
            crs: leg.board?.crs,
            stationType: leg.board?.stationType,
          },
          alight: {
            crs: leg.alight?.crs,
            stationType: leg.alight?.stationType,
          },
          originPlatform: leg.originPlatform ?? null,
          destinationPlatform: leg.destinationPlatform ?? null,
          operator: leg.operator
            ? {
                code: leg.operator.code,
                name: leg.operator.name,
              }
            : null,
          scheduledTime: leg.scheduledTime || null,
          realTime: leg.realTime || null,
          undergroundTravelInformation: leg.undergroundTravelInformation || [],
        })),
      };
    });

    const journeyCards = simplifiedJourneys.map(mapJourneyCard);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        generatedTime: data.generatedTime || null,
        journeyCards,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Failed to fetch journey plan",
        message: error.message,
      }),
    };
  }
};

