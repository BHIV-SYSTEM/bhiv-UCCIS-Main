// src/governance/replay/replayStoryAdapter.js

export function replayStoryAdapter(rawEvents = []) {

  return rawEvents.map((event, index) => ({

    id: event.id || index + 1,

    timestamp: event.time || "00:00",

    district: event.district || "Unknown",

    eventType:
      event.type || "Operational Event",

    message:
      event.message ||
      "System activity recorded.",

    severity:
      event.severity || "Info"

  }));

}