function historicalAwareness(zoneHistory) {

  if (!zoneHistory || zoneHistory.length === 0) {

    return {
      historical_average: 0,
      historical_risk: "UNKNOWN"
    };

  }

  const total =
    zoneHistory.reduce((sum, value) => {
      return sum + value;
    }, 0);

  const average =
    total / zoneHistory.length;

  return {
    historical_average: average,

    historical_risk:
      average >= 70
        ? "CHRONIC_RISK"
        : "NORMAL"
  };
}

module.exports = historicalAwareness;