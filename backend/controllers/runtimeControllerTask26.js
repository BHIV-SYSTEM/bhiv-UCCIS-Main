const RuntimeLogTask26 = require("../models/RuntimeLogTask26");

// Get logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await RuntimeLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add log
exports.addLog = async (req, res) => {
  try {
    const log = new RuntimeLog(req.body);
    await log.save();
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};