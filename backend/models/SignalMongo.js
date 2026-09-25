const mongoose = require("mongoose");

const signalMongoSchema = new mongoose.Schema(
  {
    signal_id: {
      type: String,
      index: true
    },

    type: {
      type: String,
      required: true
    },

    source_id: {
      type: mongoose.Schema.Types.Mixed
    },

    confidence: {
      type: Number,
      default: 0
    },

    timestamp: {
      type: Date,
      default: Date.now
    },

    location_id: String,

    trace_id: String,

    status: String
  },
  {
    collection: "signals",
    timestamps: true
  }
);

module.exports = mongoose.model(
  "SignalMongo",
  signalMongoSchema
);