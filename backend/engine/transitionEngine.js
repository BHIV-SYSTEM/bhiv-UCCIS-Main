function nextLevel(previousLevel, trend, score) {

  // HIGH RISK
  if (score >= 80) {
    return "HIGH";
  }

  // MEDIUM RISK
  if (score >= 50) {
    return "MEDIUM";
  }

  // LOW RISK
  return "LOW";
}

module.exports = {
  nextLevel
};