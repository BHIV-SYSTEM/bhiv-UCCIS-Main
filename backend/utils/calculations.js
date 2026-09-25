// TREND
const calculateTrend = (data) => {
  if (data[data.length - 1] > data[0]) return "INCREASING";
  if (data[data.length - 1] < data[0]) return "DECREASING";
  return "STABLE";
};

// MOVING AVERAGE (last 3)
const calculateMovingAverage = (data) => {
  const last3 = data.slice(-3);
  const avg = last3.reduce((a, b) => a + b, 0) / 3;
  return Number(avg.toFixed(2));
};

// RISK SCORE
const calculateRiskScore = (traffic_avg, violation_avg) => {
  const risk = (traffic_avg * 0.7) + (violation_avg * 10);
  return Number(risk.toFixed(2));
};

// ✅ NEW: DETERMINISTIC PREDICTION
const calculatePrediction = (data) => {
  const last3 = data.slice(-3);
  const avg = last3.reduce((a, b) => a + b, 0) / 3;

  const prediction = avg + 3; // fixed increment rule

  return Number(prediction.toFixed(2)); // ONE number only
};

// REASON GENERATION (DATA-BOUND)
const generateReason = (traffic_history, violations_history, traffic_avg, violation_avg, risk_score) => {
  const traffic_last3 = traffic_history.slice(-3);
  const violation_last3 = violations_history.slice(-3);

  return `Traffic increased from ${traffic_last3[0]} → ${traffic_last3[1]} → ${traffic_last3[2]}, moving average = ${traffic_avg}, violations ${violation_last3[0]} → ${violation_last3[1]} → ${violation_last3[2]}, violation average = ${violation_avg}, risk score = ${risk_score}`;
};

module.exports = {
  calculateTrend,
  calculateMovingAverage,
  calculateRiskScore,
  calculatePrediction,
  generateReason
};