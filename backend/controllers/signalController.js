const SignalTask27 = require("../models/SignalTask27");
const TelemetryServiceTask27 = require("../services/telemetryServiceTask27");

exports.createSignal = async (req, res) => {
  try {

    const { signalType, locationId } = req.body;

    const signal = await Signal.create(
      signalType,
      locationId
    );

    await TelemetryServiceTask27.create(
      signal.insertId
    );

    res.status(201).json({
      success: true,
      message: "Signal Created",
      signalId: signal.insertId
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};

exports.getSignals = async (req, res) => {
  try {

    const data = await Signal.getAll();

    res.json(data);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};