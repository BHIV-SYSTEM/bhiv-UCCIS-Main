function calculateConfidence(signalCount, anomalyCount) {

  /*
    Base deterministic formula
  */

  let confidence = 50;

  /*
    More corroborated signals
  */

  confidence += signalCount * 5;

  /*
    Anomalies reduce certainty
  */

  confidence -= anomalyCount * 10;

  /*
    Clamp range
  */

  if (confidence > 100) {
    confidence = 100;
  }

  if (confidence < 0) {
    confidence = 0;
  }

  return confidence;
}

module.exports = calculateConfidence;