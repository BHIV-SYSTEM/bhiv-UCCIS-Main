const normalizeSignal = require("../normalization/normalizeSignal");

function ingestFloodingData() {

  const rawData = {
    zone: "Kurla",

    metrics: {
      flood_level: 78,
      drainage_capacity: 40,
      water_logging_points: 12,
      rainfall_intensity: 91
    },

    severity: "CRITICAL",

    timestamp: new Date()
  };

  const normalizedSignal = normalizeSignal(
    rawData,
    "FLOODING"
  );

  return normalizedSignal;
}

module.exports = ingestFloodingData;