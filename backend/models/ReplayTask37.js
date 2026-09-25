const mongoose = require("mongoose");

const ReplaySchema =
  new mongoose.Schema(
    {
      replayId: String,

      traceId: String,

      status: {
        type: String,
        default: "Completed"
      },

      executionTime: Number
    },
    {
      timestamps: true
    }
  );

module.exports = mongoose.model(
  "Replay",
  ReplaySchema
);