exports.handler = async function () {
  try {
    const today = new Date().toISOString().split("T")[0];

    const response = await fetch(
      "https://api1.raildata.org.uk/1010-disruptions-experience-api-11_0/disruptions/incidents/search",
      {
        method: "POST",
        headers: {
          "x-apikey": process.env.RAILDATA_API_KEY,
          "Content-Type": "application/json;charset=UTF-8",
          "Cookie": process.env.RAILDATA_COOKIE,
        },
        body: JSON.stringify({
          startDate: today,
          endDate: today,
        }),
      }
    );

    const contentType = response.headers.get("content-type") || "application/json";
    const body = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": contentType,
      },
      body,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Failed to fetch disruption incidents",
        message: error.message,
      }),
    };
  }
};