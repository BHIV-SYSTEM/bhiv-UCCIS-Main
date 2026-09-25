const normalizeSignal = require("../normalization/normalizeSignal");
const validateTimestamp = require("../validators/timestampValidator");
const detectStaleSignal = require("../stale_detection/staleDetector");

function ingestWeatherData() {

  const rawData = {
    zone: "South Mumbai",

    metrics: {
      rainfall: 82,
      humidity: 90,
      temperature: 29
    },

    severity: "HIGH",

    timestamp: new Date()
  };

  let signal = normalizeSignal(rawData, "WEATHER");

  const valid = validateTimestamp(signal);

  if (!valid) {
    throw new Error("Invalid timestamp");
  }

  signal = detectStaleSignal(signal);

  return signal;
}

module.exports = ingestWeatherData;