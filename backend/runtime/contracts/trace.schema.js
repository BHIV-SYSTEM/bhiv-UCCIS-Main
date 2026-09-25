const mongoose =
require("mongoose");

const TraceSchema =
new mongoose.Schema({

  traceId: {
    type: String,
    required: true,
    unique: true
  },

  signalId: String,

  incidentId: String,

  escalationId: String,

  replayId: String,

  evidenceId: String,

  status: {
    type: String,
    default: "Active"
  },

  executionTime: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports =
TraceSchema;