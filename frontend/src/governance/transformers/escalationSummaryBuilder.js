// src/governance/transformers/escalationSummaryBuilder.js

export function escalationSummaryBuilder(
  escalations = []
) {

  if (!escalations.length) {

    return {
      totalEscalations: 0,
      criticalEscalations: 0,
      highPriorityEscalations: 0,
      statewideImpact:
        "No major operational escalations detected.",
      executiveRecommendation:
        "Continue statewide monitoring."
    };
  }

  const criticalEscalations =
    escalations.filter(
      item =>
        item.escalationLevel ===
        "State Priority"
    ).length;

  const highPriorityEscalations =
    escalations.filter(
      item =>
        item.escalationLevel ===
        "High Priority"
    ).length;

  return {

    totalEscalations:
      escalations.length,

    criticalEscalations,

    highPriorityEscalations,

    statewideImpact:
      criticalEscalations > 2
        ? "Multiple districts are experiencing critical operational pressure."
        : "Operational escalations remain regionally contained.",

    executiveRecommendation:
      criticalEscalations > 2
        ? "Immediate statewide coordination review recommended."
        : "Maintain district-level escalation supervision."

  };
}