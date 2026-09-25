const mongoose = require("mongoose");

const ReplaySchema = new mongoose.Schema(
  {
    replayId: String,
    traceId: String,
    status: {
      type: String,
      default: "READY"
    },
    executionTime: Number,
    result: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Replay",
  ReplaySchema
);