function detectAnomaly(current, historicalAverage) {

  const difference =
    current - historicalAverage;

  if (difference >= 30) {
    return {
      anomaly: true,
      anomaly_type: "SEVERE_DEVIATION"
    };
  }

  return {
    anomaly: false,
    anomaly_type: "NORMAL"
  };
}

module.exports = detectAnomaly;