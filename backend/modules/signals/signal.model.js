const mongoose = require("mongoose");

const SignalSchema = new mongoose.Schema(
  {
    traceId: {
      type: String,
      required: true
    },

    signalId: {
      type: String,
      required: true
    },

    source: {
      type: String,
      default: "Runtime Engine"
    },

    severity: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical"
      ],
      default: "Medium"
    },

    status: {
      type: String,
      default: "SIGNAL_RECEIVED"
    },

    payload: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "Signal",
    SignalSchema
  );