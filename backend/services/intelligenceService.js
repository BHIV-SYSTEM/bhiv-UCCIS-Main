const {
  calculateTrend,
  calculateMovingAverage,
  calculateRiskScore,
  calculatePrediction,
  generateReason
} = require("../utils/calculations");

// ✅ Zone-wise data (can later move to DB)
const zoneData = {
  1: {
    traffic: [40, 50, 55, 60, 65, 70, 75],
    violations: [1, 1, 2, 2, 3, 3, 3]
  },
  2: {
    traffic: [70, 72, 74, 76, 78, 80, 82],
    violations: [3, 3, 4, 4, 4, 5, 5]
  },
  3: {
    traffic: [30, 35, 40, 42, 45, 48, 50],
    violations: [1, 2, 1, 2, 2, 2, 3]
  },
  4: {
    traffic: [60, 68, 75, 82, 83, 86, 90],
    violations: [2, 3, 1, 4, 4, 4, 5]
  },
  5: {
    traffic: [50, 55, 60, 62, 65, 67, 70],
    violations: [2, 2, 3, 3, 3, 4, 4]
  },
  6: {
    traffic: [80, 82, 85, 88, 90, 92, 95],
    violations: [4, 4, 5, 5, 6, 6, 7]
  }
};

const processIntelligence = (zone_id = 4) => {

  const zone = zoneData[zone_id];

  // ❗ handle invalid zone
  if (!zone) {
    return {
      trace_id: `zone_${zone_id}_001`,
      error: "Invalid zone_id"
    };
  }

  const traffic_history = zone.traffic;
  const violations_history = zone.violations;

  const traffic_trend = calculateTrend(traffic_history).toLowerCase();
  const violation_trend = calculateTrend(violations_history).toLowerCase();

  const moving_average = calculateMovingAverage(traffic_history);
  const violation_average = calculateMovingAverage(violations_history);

  const risk_score = calculateRiskScore(moving_average, violation_average);

  const prediction = calculatePrediction(traffic_history);

  const reason = generateReason(
    traffic_history,
    violations_history,
    moving_average,
    violation_average,
    risk_score
  );

  // ✅ deterministic trace (UNCHANGED FLOW)
  const trace_id = `zone_${zone_id}_001`;

  return {
    trace_id,
    traffic_trend,
    violation_trend,
    moving_average,
    violation_average,
    risk_score,
    prediction,
    reason,
    traffic_history,
    violations_history
  };
};

module.exports = { processIntelligence };