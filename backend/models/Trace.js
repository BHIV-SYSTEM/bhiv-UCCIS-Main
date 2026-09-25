const mongoose = require("mongoose");

const TraceSchema = new mongoose.Schema({
  trace_id: { type: String, index: true },
  domain: String,
  status: { type: String, default: "ACTIVE" },
  event_count: { type: Number, default: 0 },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Trace", TraceSchema);