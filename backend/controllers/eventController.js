const runtime = require("../services/runtimeEngine");

exports.ingestEvent = async (req, res) => {
  try {
    const event = await runtime.ingestEvent(req.body);
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await runtime.getEvents(req.query);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTimeline = async (req, res) => {
  try {
    const data = await runtime.getTimeline(req.params.trace_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};