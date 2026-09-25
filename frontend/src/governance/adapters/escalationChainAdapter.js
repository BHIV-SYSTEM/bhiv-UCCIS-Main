// src/governance/adapters/escalationChainAdapter.js

export function escalationChainAdapter(rawEscalations = []) {

  return rawEscalations.map((item, index) => ({

    id: item.id || index + 1,

    district:
      item.district || "Unknown District",

    escalationLevel:
      item.priorityScore > 90
        ? "State Priority"
        : item.priorityScore > 70
        ? "High Priority"
        : "Moderate Priority",

    issue:
      item.issue ||
      "Operational escalation detected.",

    escalationReason:
      item.reason ||
      "Rapid increase in operational stress indicators.",

    assignedAuthority:
      item.authority ||
      "Regional Operations Office",

    responseStatus:
      item.status || "Awaiting Coordination",

    lastUpdated:
      item.updatedAt || "5 mins ago"

  }));
}