// src/governance/transformers/workflowStatusTransformer.js

export function workflowStatusTransformer(
  workflows = []
) {

  return workflows.map(workflow => {

    const age =
      workflow.ageHours || 0;

    return {

      workflowId:
        workflow.id,

      workflowName:
        workflow.name ||
        "Operational Workflow",

      district:
        workflow.district ||
        "Unknown District",

      currentStatus:
        age > 6
          ? "Critical Delay"
          : age > 3
          ? "Delayed"
          : "Operationally Stable",

      operationalMessage:
        age > 6
          ? "Workflow resolution significantly delayed and requires administrative intervention."

          : age > 3
          ? "Workflow progressing slower than expected."

          : "Workflow progressing within operational expectations.",

      pendingDepartment:
        workflow.department ||
        "Emergency Operations",

      unresolvedDuration:
        `${age} hrs`,

      executiveAttention:
        age > 6
          ? "Immediate escalation review required."
          : "Continue operational monitoring."

    };
  });
}