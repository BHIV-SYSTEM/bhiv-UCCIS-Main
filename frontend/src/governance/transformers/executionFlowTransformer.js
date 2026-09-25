// src/governance/transformers/executionFlowTransformer.js

export function executionFlowTransformer(
  executionFlows = []
) {

  return executionFlows.map(
    (flow, index) => {

      const progress =
        flow.progress || 0;

      return {

        id:
          flow.id || index + 1,

        operationName:
          flow.operationName ||
          "Operational Deployment",

        district:
          flow.district ||
          "Unknown District",

        assignedTeam:
          flow.assignedTeam ||
          "Field Operations Unit",

        executionStage:
          progress >= 100
            ? "Completed"

            : progress >= 70
            ? "Final Deployment"

            : progress >= 40
            ? "Execution In Progress"

            : "Initial Coordination",

        executionProgress:
          `${progress}%`,

        operationalStatus:
          progress >= 100
            ? "Operational objective completed successfully."

            : progress >= 70
            ? "Execution nearing completion."

            : progress >= 40
            ? "Field execution currently active."

            : "Operational coordination initiated.",

        dependencyStatus:
          flow.dependencyStatus ||
          "Dependencies stable.",

        estimatedCompletion:
          flow.estimatedCompletion ||
          "45 mins",

        recommendedAction:
          progress < 40
            ? "Increase operational coordination."

            : progress < 70
            ? "Continue monitored execution."

            : "Prepare completion validation."

      };
    });
}