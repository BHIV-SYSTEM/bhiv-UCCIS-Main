function detectAnomalies(events) {

  let anomalies = [];

  events.forEach((event) => {

    if (event.payload?.severity === "critical") {

      anomalies.push({
        type: "CRITICAL_SIGNAL",
        timestamp: event.timestamp
      });

    }

  });

  return anomalies;
}

module.exports = {
  detectAnomalies
};