const mongoose = require("mongoose");

const replaySchema = new mongoose.Schema(
  {
    replayId: {
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

    status: {
      type: String,
      default: "Completed"
    },

    startedAt: {
      type: Date
    },

    completedAt: {
      type: Date
    },

    duration: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "Replay",
    replaySchema
  );