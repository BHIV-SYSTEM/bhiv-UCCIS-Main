const mongoose =
  require("mongoose");

const EscalationSchema =
  new mongoose.Schema(
    {
      escalationId: String,
      traceId: String,
      priority: String,
      assignedTo: String,
      status: String
    },
    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(
    "Escalation",
    EscalationSchema
  );