// src/governance/live/staleTelemetryDetector.js

export function staleTelemetryDetector(
  feeds = []
) {

  return feeds.map((f) => {

    const age =
      f.ageSeconds || 0;

    return {

      source: f.source,

      status:
        age > 120
          ? "STALE"
          : "LIVE",

      warning:
        age > 120
          ? "Telemetry delayed — operational blind spot risk"
          : "Live feed healthy"

    };
  });
}