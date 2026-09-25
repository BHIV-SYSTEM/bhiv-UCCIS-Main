// src/governance/visibility/visibilityPolicy.js

export const visibilityPolicy = {
  minister: [
    "executive_summary",
    "district_health",
    "major_escalations"
  ],

  secretary: [
    "resource_pressure",
    "execution_delays",
    "escalation_aging"
  ],

  osd: [
    "assignments",
    "dependencies",
    "field_coordination"
  ],

  field: [
    "tasks",
    "deadlines",
    "incident_updates"
  ]
};