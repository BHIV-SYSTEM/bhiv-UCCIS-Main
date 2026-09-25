const Trace = require("../models/Trace");

exports.getAllTraces = async (req, res) => {
  try {
    const traces = await Trace.find().sort({ updated_at: -1 });
    res.json(traces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTraceById = async (req, res) => {
  try {
    const trace = await Trace.findOne({ trace_id: req.params.trace_id });
    res.json(trace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};