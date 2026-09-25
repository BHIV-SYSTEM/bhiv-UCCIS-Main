// src/governance/transformers/fieldAcknowledgementTransformer.js

export function fieldAcknowledgementTransformer(
  acknowledgements = []
) {

  return acknowledgements.map(
    (ack, index) => {

      const status =
        ack.status || "Pending";

      return {

        id:
          ack.id || index + 1,

        officer:
          ack.officer ||
          "Field Officer",

        district:
          ack.district ||
          "Unknown District",

        assignedTask:
          ack.assignedTask ||
          "Operational Assignment",

        acknowledgementStatus:
          status,

        operationalMeaning:

          status === "Acknowledged"

            ? "Field officer confirmed task acceptance."

            : status === "In Progress"

            ? "Field officer currently executing assigned task."

            : status === "Completed"

            ? "Operational task execution completed successfully."

            : "Task acknowledgement pending from field team.",

        responseTime:
          ack.responseTime ||
          "12 mins",

        escalationRequired:

          status === "Pending"
            ? "Yes"
            : "No",

        escalationContact:
          ack.escalationContact ||
          "District Operations Center"

      };
    });
}