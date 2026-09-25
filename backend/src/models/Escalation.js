const mongoose = require("mongoose");

const EscalationSchema = new mongoose.Schema(
  {
    escalationId: String,
    incidentId: String,
    traceId: String,
    assignedTo: String,
    priority: String,
    status: {
      type: String,
      default: "ACTIVE"
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