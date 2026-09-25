const normalizeSignal = require("../normalization/normalizeSignal");

function ingestComplaintData() {

  const rawData = {
    zone: "Dadar",

    metrics: {
      complaints: 212,
      escalation_rate: 61
    },

    severity: "HIGH",

    timestamp: new Date()
  };

  return normalizeSignal(rawData, "CIVIC_COMPLAINTS");
}

module.exports = ingestComplaintData;