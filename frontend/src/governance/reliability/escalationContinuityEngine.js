// src/governance/reliability/escalationContinuityEngine.js

export function escalationContinuityEngine(
  escalations = []
) {

  return escalations.map((e) => ({

    id: e.id,

    continuity:

      e.acknowledged &&
      e.assigned &&
      e.resolved,

    state:

      e.resolved
        ? "COMPLETE"
        : e.assigned
        ? "ACTIVE"
        : "PENDING"

  }));

}