// src/governance/transformers/executionDelayTransformer.js

export function executionDelayTransformer(
  executions = []
) {

  return executions.map(execution => {

    const delay =
      execution.delayMinutes || 0;

    return {

      department:
        execution.department ||
        "Unknown Department",

      district:
        execution.district ||
        "Unknown District",

      delayDuration:
        `${delay} mins`,

      operationalSeverity:
        delay > 60
          ? "Critical"
          : delay > 30
          ? "High"
          : "Moderate",

      delayReason:
        execution.reason ||
        "Operational congestion detected.",

      executionImpact:
        delay > 60
          ? "Critical operational response degradation possible."

          : delay > 30
          ? "Execution efficiency reduced across dependent workflows."

          : "Minor operational slowdown detected.",

      recommendedAction:
        delay > 60
          ? "Immediate intervention and resource redistribution recommended."

          : delay > 30
          ? "Increase operational coordination capacity."

          : "Continue monitoring execution performance.",

      updatedAt:
        execution.updatedAt ||
        "5 mins ago"

    };
  });
}