const normalizeSignal = require("../normalization/normalizeSignal");

function ingestTrafficData() {

  const rawData = {
    zone: "Bandra",

    metrics: {
      congestion: 88,
      avg_speed: 12
    },

    severity: "HIGH",

    timestamp: new Date()
  };

  return normalizeSignal(rawData, "TRAFFIC");
}

module.exports = ingestTrafficData;