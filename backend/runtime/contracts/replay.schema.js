const mongoose =
require("mongoose");

const ReplaySchema =
new mongoose.Schema({

  replayId: {
    type: String,
    required: true
  },

  traceId: {
    type: String,
    required: true
  },

  incidentId: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "Completed"
  },

  duration: {
    type: Number,
    default: 0
  },

  startedAt: {
    type: Date,
    default: Date.now
  },

  completedAt: {
    type: Date,
    default: Date.now
  }

});

module.exports =
ReplaySchema;