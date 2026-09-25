const mongoose = require("mongoose");

const EscalationSchema =
  new mongoose.Schema(
    {
      escalationId: String,

      traceId: String,

      priority: String,

      assignedTo: String,

      status: {
        type: String,
        default: "Pending"
      }
    },
    {
      timestamps: true
    }
  );

module.exports = mongoose.model(
  "Escalation",
  EscalationSchema
);