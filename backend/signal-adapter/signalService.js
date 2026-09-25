// backend/signal-adapter/signalService.js

const axios = require("axios");
const config = require("../config/fastapi.config");

const fetchSignals = async () => {
  try {
    const url =
      `${config.baseURL}${config.endpoints.signals}`;

    console.log("====================================");
    console.log("📡 Fetching Signals");
    console.log("URL:", url);
    console.log("====================================");

    const response = await axios.get(url, {
      timeout: 5000
    });

    console.log("✅ Signal Response Received");
    console.log(response.data);

    // Handle array response
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Handle wrapped response
    if (
      response.data &&
      Array.isArray(response.data.signals)
    ) {
      return response.data.signals;
    }

    console.log("⚠ No valid signals returned");
    return [];

  } catch (err) {
    console.error("====================================");
    console.error("❌ Signal Fetch Failed");
    console.error(err.message);

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response:", err.response.data);
    }

    console.error("====================================");

    // Demo fallback data
    return [
      {
        id: 1,
        signal_type: "Flood",
        location: "Pune",
        severity: "HIGH",
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        signal_type: "Traffic",
        location: "Hinjewadi",
        severity: "MEDIUM",
        timestamp: new Date().toISOString()
      },
      {
        id: 3,
        signal_type: "Water",
        location: "Baner",
        severity: "LOW",
        timestamp: new Date().toISOString()
      }
    ];
  }
};

module.exports = { fetchSignals };