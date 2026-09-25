export function generateTelemetry() {
  return {
    alerts: Math.floor(Math.random() * 20),
    stability: (85 + Math.random() * 10).toFixed(1),
    escalation: Math.floor(Math.random() * 10),
    velocity: (1 + Math.random()).toFixed(1),

    feed: [
      "Transport escalation reviewed",
      "Water pipeline stabilized",
      "Energy fluctuation detected",
      "Health system load balanced",
      "Network integrity verified"
    ][Math.floor(Math.random() * 5)],

    risk:
      ["LOW", "MODERATE", "HIGH"][
        Math.floor(Math.random() * 3)
      ]
  };
}