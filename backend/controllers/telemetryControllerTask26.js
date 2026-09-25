const TelemetryTask26 = require("../models/TelemetryTask26");

// Get all telemetry
exports.getTelemetry = async (req, res) => {
  try {
    const data = await Telemetry.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add telemetry signal
exports.addTelemetry = async (req, res) => {
  try {
    const newSignal = new Telemetry(req.body);
    await newSignal.save();
    res.json(newSignal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};