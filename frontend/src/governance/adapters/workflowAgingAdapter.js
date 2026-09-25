// src/governance/adapters/workflowAgingAdapter.js

export function workflowAgingAdapter(rawWorkflows = []) {

  return rawWorkflows.map((workflow, index) => {

    const ageHours =
      workflow.ageHours || 0;

    return {

      id:
        workflow.id || index + 1,

      workflowName:
        workflow.name ||
        "Operational Workflow",

      district:
        workflow.district ||
        "Unknown District",

      currentStage:
        workflow.stage ||
        "Pending Approval",

      agingCategory:
        ageHours > 6
          ? "Critical Delay"
          : ageHours > 3
          ? "Delayed"
          : "Stable",

      unresolvedDuration:
        `${ageHours} hrs`,

      bottleneckReason:
        workflow.reason ||
        "Administrative coordination pending.",

      assignedDepartment:
        workflow.department ||
        "Emergency Operations",

      recommendedAction:
        workflow.action ||
        "Escalate workflow resolution."

    };
  });
}