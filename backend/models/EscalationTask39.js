const mongoose = require("mongoose");

const escalationSchema = new mongoose.Schema(
  {
    escalationId: {
      type: String,
      required: true,
      unique: true
    },

    incidentId: {
      type: String,
      required: true
    },

    traceId: {
      type: String,
      required: true
    },

    priority: {
      type: String,
      default: "Medium"
    },

    assignedTo: {
      type: String,
      default: "Runtime Team"
    },

    status: {
      type: String,
      default: "Open"
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "Escalation",
    escalationSchema
  );