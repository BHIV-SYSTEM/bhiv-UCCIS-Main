// src/governance/replay/replayContinuityValidator.js

export function replayContinuityValidator(events = []) {

  const issues = [];

  for (let i = 1; i < events.length; i++) {

    const prev = events[i - 1];
    const curr = events[i];

    if (!prev.timestamp || !curr.timestamp) {
      issues.push("Missing timestamp continuity");
    }

    if (curr.timestamp < prev.timestamp) {
      issues.push("Timeline ordering inconsistency detected");
    }

  }

  return {
    valid: issues.length === 0,
    issues
  };

}