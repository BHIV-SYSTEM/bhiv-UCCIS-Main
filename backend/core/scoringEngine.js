function round2(n) {
  return Math.round(n * 100) / 100;
}

function computeRiskScore(signal) {
  const weights = {
    traffic: 0.25,
    water: 0.2,
    flood: 0.2,
    waste: 0.15,
    complaint: 0.2,
  };

  let score =
    weights.traffic * signal.traffic_score +
    weights.water * signal.water_score +
    weights.flood * signal.flood_score +
    weights.waste * signal.waste_score +
    weights.complaint * signal.complaint_score;

  // strict normalization
  score = Math.max(0, Math.min(100, round2(score)));

  return score;
}

module.exports = { computeRiskScore };