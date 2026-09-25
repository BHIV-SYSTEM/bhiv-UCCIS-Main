const normalizeSignal = require("../normalization/normalizeSignal");

function ingestWasteData() {

  const rawData = {
    zone: "Chembur",

    metrics: {
      garbage_load: 92,
      overflow_points: 17
    },

    severity: "HIGH",

    timestamp: new Date()
  };

  return normalizeSignal(rawData, "WASTE_OVERLOAD");
}

module.exports = ingestWasteData;