const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    incidentId: {
      type: String,
      required: true,
      unique: true
    },

    signalId: {
      type: String,
      required: true
    },

    traceId: {
      type: String,
      required: true
    },

    severity: {
      type: String,
      default: "Medium"
    },

    telemetryId: {
      type: mongoose.Schema.Types.ObjectId
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
    "Incident",
    incidentSchema
  );