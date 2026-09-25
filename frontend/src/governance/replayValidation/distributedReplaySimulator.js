// src/governance/replayValidation/distributedReplaySimulator.js

export function distributedReplaySimulator(events = []) {

  // Simulates concurrent inflow of events
  const shuffled = [...events].sort(() => Math.random() - 0.5);

  return shuffled.map((event, index) => ({

    id: event.id || index + 1,

    timestamp: event.timestamp,

    action: event.action,

    sourceNode:
      event.sourceNode || "NODE-A",

    status: "ARRIVED"

  }));
}