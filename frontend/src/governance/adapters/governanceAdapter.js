// src/governance/adapters/governanceAdapter.js

import { sanitizeOperationalData } from "../safety/governanceSanitizer";

export function governanceAdapter(raw) {
  const safe = sanitizeOperationalData(raw);

  return {
    id: safe.id,

    title:
      safe.type === "flood"
        ? "Critical Flood Risk Escalation"
        : "Operational Incident",

    district: safe.zone,

    severity:
      safe.priority_score > 0.85
        ? "Critical"
        : safe.priority_score > 0.65
        ? "High"
        : "Moderate",

    operationalImpact:
      "Waterlogging expected across multiple sectors.",

    citizenRisk:
      "Potential disruption to transport and emergency movement.",

    affectedZones: safe.affectedZones || [],

    recommendedAction:
      "Mobilize drainage response teams immediately.",

    escalationOwner:
      "District Control Office",

    confidence:
      safe.confidence || "High Confidence",

    lastUpdated:
      safe.updatedAt || "2 mins ago"
  };
}