const Escalation = require("../models/Escalation");
const logger = require("./runtimeLogger");

function evaluate(signal) {
  let level = "LOW";
  let assignedTo = "Monitoring Team";

  if (signal.severity === "HIGH") {
    level = "HIGH";
    assignedTo = "Supervisor";
  }

  if (signal.severity === "CRITICAL") {
    level = "CRITICAL";
    assignedTo = "Principal Secretary";
  }

  Escalation.create(
    {
      incident_id: signal.id || 0,
      escalation_level: level,
      escalated_to: assignedTo,
      status: "ACTIVE",
    },
    () => {}
  );

  logger.writeLog(
    "escalation",
    `Signal ${signal.id} escalated to ${assignedTo}`
  );

  return {
    level,
    assignedTo,
  };
}

module.exports = {
  evaluate,
};