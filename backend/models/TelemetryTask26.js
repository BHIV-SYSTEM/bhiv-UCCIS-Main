const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema(
  {
    signalId: String,
    type: String,
    value: Number,
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { collection: "telemetry" }
);

module.exports = mongoose.model("Telemetry", telemetrySchema);