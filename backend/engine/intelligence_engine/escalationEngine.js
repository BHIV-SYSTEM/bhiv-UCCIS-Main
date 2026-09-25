function determineEscalation(score) {

  if (score >= 80) {
    return "CRITICAL";
  }

  if (score >= 60) {
    return "HIGH";
  }

  if (score >= 40) {
    return "MODERATE";
  }

  return "LOW";
}

module.exports = determineEscalation;