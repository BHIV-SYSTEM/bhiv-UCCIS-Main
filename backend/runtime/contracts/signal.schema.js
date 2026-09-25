const mongoose =
require("mongoose");

const SignalSchema =
new mongoose.Schema({

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
    enum: [
      "Low",
      "Medium",
      "High",
      "Critical"
    ],
    default: "Low"
  },

  payload: {
    type: Object,
    default: {}
  },

  status: {
    type: String,
    default: "Received"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports =
SignalSchema;