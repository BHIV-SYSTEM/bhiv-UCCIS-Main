const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema({
  cpu: Number,
  memory: Number,
  network: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Telemetry", telemetrySchema);