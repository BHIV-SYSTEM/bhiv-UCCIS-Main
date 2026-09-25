// src/governance/transformers/replayNarrativeBuilder.js

export function replayNarrativeBuilder(events) {
  return events.map((event) => ({
    time: event.time,

    narrative:
      event.type === "rainfall"
        ? "Heavy rainfall signals increased across affected sectors."

        : event.type === "complaint"
        ? "Citizen complaints began rising rapidly."

        : event.type === "dispatch"
        ? "Emergency response teams dispatched."

        : "Operational update recorded."
  }));
}