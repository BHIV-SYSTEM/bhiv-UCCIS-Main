function calculateRisk(data) {

  let score = 0;

  if (data.traffic > 70) {
    score += 20;
  }

  if (data.pollution > 80) {
    score += 30;
  }

  if (data.water < 40) {
    score += 25;
  }

  return {
    risk_score: score,
    status: score > 50 ? "HIGH" : "MODERATE"
  };
}

module.exports = calculateRisk;