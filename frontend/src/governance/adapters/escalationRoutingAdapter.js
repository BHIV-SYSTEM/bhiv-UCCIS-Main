// src/governance/adapters/escalationRoutingAdapter.js

export function escalationRoutingAdapter(
  rawRoutes = []
) {

  return rawRoutes.map(
    (route, index) => {

      const status =
        route.status || "Pending";

      return {

        id:
          route.id || index + 1,

        district:
          route.district ||
          "Unknown District",

        escalationType:
          route.escalationType ||
          "Operational Escalation",

        routedTo:
          route.routedTo ||
          "Regional Operations Office",

        currentStatus:
          status,

        routingPriority:
          route.priority ||
          "High",

        operationalMeaning:

          status === "In Progress"

            ? "Escalation currently under operational coordination."

            : status === "Resolved"

            ? "Escalation successfully resolved."

            : status === "Transferred"

            ? "Escalation transferred to higher authority."

            : "Escalation awaiting operational review.",

        escalationReason:
          route.reason ||
          "Operational stress indicators exceeded threshold.",

        responseOwner:
          route.owner ||
          "District Emergency Authority",

        responseETA:
          route.responseETA ||
          "30 mins",

        updatedAt:
          route.updatedAt ||
          "8 mins ago"

      };
    });
}