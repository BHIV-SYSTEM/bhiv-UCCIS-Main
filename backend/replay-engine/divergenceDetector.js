function detectDivergence(replay) {

  if (replay.confidence < 40) {
    replay.divergence = true;
    replay.uncertainty = "HIGH";
  }

  if (replay.confidence < 20) {
    replay.corruption = true;
  }

  if (replay.confidence < 10) {
    replay.delayedRecovery = true;
  }

  return replay;
}

module.exports = detectDivergence;