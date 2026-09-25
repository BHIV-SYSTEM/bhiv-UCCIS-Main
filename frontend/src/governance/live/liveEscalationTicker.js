// src/governance/live/liveEscalationTicker.js

export function liveEscalationTicker(events = []) {

  const now =
    new Date().getTime();

  return events
    .slice(-10)
    .map((e) => ({

      message: e.message,

      district: e.district,

      ageMinutes:
        Math.floor(
          (now -
            new Date(e.timestamp).getTime()
          ) / 60000
        ),

      severity:
        e.severity || "INFO"

    }));

}