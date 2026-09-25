const normalizeSignal = require("../normalization/normalizeSignal");

function ingestWaterData() {

  const rawData = {
    zone: "Andheri",

    metrics: {
      reservoir_level: 45,
      pressure_drop: 31
    },

    severity: "MODERATE",

    timestamp: new Date()
  };

  return normalizeSignal(rawData, "WATER_SUPPLY");
}

module.exports = ingestWaterData;