// Moving Average
const movingAverage = (arr) => {
  const sum = arr.reduce((a, b) => a + b, 0);
  return Number((sum / arr.length).toFixed(2));
};

// Trend Detection
const getTrend = (arr) => {
  if (arr[arr.length - 1] > arr[0]) return "INCREASING";
  if (arr[arr.length - 1] < arr[0]) return "DECREASING";
  return "STABLE";
};

// Risk Score
const calculateRisk = (trafficAvg, violationAvg) => {
  return Number((trafficAvg * 0.6 + violationAvg * 10).toFixed(2));
};

// Prediction
const getPrediction = (trafficArr) => {
  const avg = movingAverage(trafficArr);
  const next = avg + 5;

  if (next > 80) return "HIGH";
  if (next > 50) return "MEDIUM";
  return "LOW";
};

// Decision Type
const getDecisionType = (riskScore) => {
  if (riskScore >= 80) return "HIGH_PRIORITY";
  if (riskScore >= 50) return "MEDIUM";
  return "LOW";
};

// Decision Ready
const isDecisionReady = (riskScore) => {
  return riskScore >= 50;
};

module.exports = {
  movingAverage,
  getTrend,
  calculateRisk,
  getPrediction,
  getDecisionType,
  isDecisionReady
};