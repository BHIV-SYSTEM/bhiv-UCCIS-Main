const mongoose = require("mongoose");

const SignalSchema = new mongoose.Schema(
  {
    signalId: String,

    source: String,

    severity: String,

    status: {
      type: String,
      default: "Open"
    },

    description: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Signal",
  SignalSchema
);