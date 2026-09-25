// src/governance/adapters/assignmentQueueAdapter.js

export function assignmentQueueAdapter(
  rawAssignments = []
) {

  return rawAssignments.map(
    (assignment, index) => {

      const pending =
        assignment.pendingAssignments || 0;

      return {

        id:
          assignment.id || index + 1,

        department:
          assignment.department ||
          "Operational Department",

        assignmentCategory:
          assignment.category ||
          "Emergency Coordination",

        pendingAssignments:
          pending,

        operationalPriority:

          pending > 15
            ? "Critical"

            : pending > 8
            ? "High"

            : "Moderate",

        operationalPressure:

          pending > 15
            ? "Assignment queue under significant operational load."

            : pending > 8
            ? "Assignment queue experiencing moderate pressure."

            : "Assignment queue operating normally.",

        assignedCoordinator:
          assignment.coordinator ||
          "District Operations Coordinator",

        estimatedClearance:
          assignment.estimatedClearance ||
          "2 hrs",

        recommendedAction:

          pending > 15
            ? "Increase operational workforce allocation."

            : pending > 8
            ? "Monitor assignment distribution closely."

            : "Continue operational supervision.",

        updatedAt:
          assignment.updatedAt ||
          "5 mins ago"

      };
    });
}