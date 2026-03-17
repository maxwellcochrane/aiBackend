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

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        generatedTime: data.generatedTime || null,
        journeys: simplifiedJourneys,
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

