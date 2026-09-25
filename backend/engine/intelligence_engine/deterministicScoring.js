function deterministicScoring(metrics) {

  let score = 0;

  /*
    WEATHER
  */

  if (metrics.rainfall >= 80) {
    score += 25;
  }

  if (metrics.humidity >= 85) {
    score += 10;
  }

  /*
    FLOODING
  */

  if (metrics.flood_level >= 70) {
    score += 30;
  }

  /*
    TRAFFIC
  */

  if (metrics.congestion >= 80) {
    score += 20;
  }

  /*
    COMPLAINTS
  */

  if (metrics.complaints >= 150) {
    score += 15;
  }

  return score;
}

module.exports = deterministicScoring;