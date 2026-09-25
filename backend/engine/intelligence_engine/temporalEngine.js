function temporalAnalysis(signals) {

  let increasingSignals = 0;

  signals.forEach((signal) => {

    if (
      signal.trend === "RISING" ||
      signal.trend === "SHARPLY_RISING"
    ) {
      increasingSignals++;
    }

  });

  return {
    temporal_pressure: increasingSignals,
    temporal_status:
      increasingSignals >= 3
        ? "ESCALATING"
        : "NORMAL"
  };
}

module.exports = temporalAnalysis;