const mongoose = require("mongoose");

const TraceSchema = new mongoose.Schema(
  {
    traceId: {
      type: String,
      required: true,
      unique: true
    },

    signalId: String,

    telemetryId: String,

    incidentId: String,

    escalationId: String,

    replayId: String,

    evidenceId: String,

    currentStage: {
      type: String,
      default: "SIGNAL"
    },

    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Trace",
  TraceSchema
);