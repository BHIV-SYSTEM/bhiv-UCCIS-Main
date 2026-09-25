// src/governance/replay/replayTimelineBuilder.js

export function replayTimelineBuilder(events = []) {

  const sorted =
    [...events].sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );

  return sorted.map((event) => {

    return `${event.timestamp} → ${event.message}`;

  });

}