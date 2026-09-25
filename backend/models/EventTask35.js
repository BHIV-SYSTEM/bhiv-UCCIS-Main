const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  trace_id: { type: String, index: true },
  event_type: { type: String, required: true }, // signal | telemetry | incident | escalation | replay
  domain: { type: String, required: true }, // flood | traffic | medical | etc
  status: { type: String, default: "ACTIVE" },
  source: { type: String, default: "system" },
  payload: { type: Object, default: {} },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", EventSchema);