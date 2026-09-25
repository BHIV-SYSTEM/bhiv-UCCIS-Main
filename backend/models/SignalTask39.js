const mongoose = require("mongoose");

const signalSchema = new mongoose.Schema(
  {
    signalId: {
      type: String,
      required: true,
      unique: true
    },

    source: {
      type: String,
      required: true
    },

    severity: {
      type: String,
      default: "Medium"
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
    signalSchema
  );