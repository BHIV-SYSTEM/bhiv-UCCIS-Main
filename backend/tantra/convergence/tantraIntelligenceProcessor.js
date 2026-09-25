function tantraIntelligenceProcessor(signal) {

  let intelligenceScore = 0;

  if (
    signal.metrics.flood_level >= 80
  ) {
    intelligenceScore += 50;
  }

  if (
    signal.metrics.congestion >= 80
  ) {
    intelligenceScore += 30;
  }

  return {

    trace_id:
      signal.trace_id,

    stage:
      "INTELLIGENCE",

    intelligence_score:
      intelligenceScore,

    escalation:
      intelligenceScore >= 70
        ? "CRITICAL"
        : "MODERATE",

    timestamp:
      new Date()
  };
}

module.exports =
tantraIntelligenceProcessor;