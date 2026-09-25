const mongoose = require("mongoose");

const TelemetrySchema = new mongoose.Schema(
  {
    telemetryId: {
      type: String,
      required: true,
      unique: true
    },

    traceId: {
      type: String,
      required: true
    },

    signalId: {
      type: String,
      required: true
    },

    cpuUsage: {
      type: Number,
      default: 0
    },

    memoryUsage: {
      type: Number,
      default: 0
    },

    responseTime: {
      type: Number,
      default: 0
    },

    serviceName: {
      type: String,
      default: "Runtime Engine"
    },

    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Telemetry", TelemetrySchema);