const mongoose = require("mongoose");

const TelemetrySchema = new mongoose.Schema(
  {
    traceId: String,
    source: String,
    metric: String,
    value: Number,
    status: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Telemetry",
  TelemetrySchema
);