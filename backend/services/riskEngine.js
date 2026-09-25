const clamp = require("../utils/clamp");

const weights = {
  traffic: 0.30,
  water: 0.20,
  flood: 0.25,
  waste: 0.15,
  complaint: 0.10
};

function calculateRiskScore(data) {
  const t = clamp(data.traffic_score);
  const w = clamp(data.water_score);
  const f = clamp(data.flood_score);
  const wa = clamp(data.waste_score);
  const c = clamp(data.complaint_score);

  let risk =
    (weights.traffic * t) +
    (weights.water * w) +
    (weights.flood * f) +
    (weights.waste * wa) +
    (weights.complaint * c);

  return parseFloat(risk.toFixed(2));
}

function calculateConfidenceScore(data) {
  const completeness =
    data.traffic_score != null &&
    data.water_score != null &&
    data.flood_score != null &&
    data.waste_score != null &&
    data.complaint_score != null
      ? 100
      : 60;

  const freshness = clamp(data.freshness_score);
  const trend = clamp(data.trend_consistency_score);
  const domain = clamp(data.domain_agreement_score);

  let confidence =
    (0.30 * completeness) +
    (0.25 * freshness) +
    (0.25 * trend) +
    (0.20 * domain);

  return parseFloat(confidence.toFixed(2));
}

module.exports = {
  calculateRiskScore,
  calculateConfidenceScore
};