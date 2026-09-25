const { task34DB } = require("../config/db");

exports.getSignals = async (req, res) => {
  try {
    const traceId = req.traceId;

    res.status(200).json({
      success: true,
      layer: "Signal",
      traceId,
      totalSignals: 12,
      activeSignals: 8,
      criticalSignals: 4
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createSignal = async (req, res) => {
  try {
    const { signalName, severity } = req.body;

    res.status(201).json({
      success: true,
      message: "Signal Created",
      signalName,
      severity,
      traceId: req.traceId
    });
  } catch (error) {
    res.status(500).json(error);
  }
};