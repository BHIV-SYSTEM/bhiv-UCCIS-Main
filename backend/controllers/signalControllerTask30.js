const SignalTask30 = require("../models/SignalTask30");

exports.getSignals = async (req, res) => {
  try {
    const [rows] = await SignalTask30.getAll();

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSignalById = async (req, res) => {
  try {
    const [rows] = await SignalTask30.getById(req.params.id);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Signal Not Found"
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createSignal = async (req, res) => {
  try {
    const { signal_type, location_id } = req.body;

    const [result] = await SignalTask30.create(
      signal_type,
      location_id
    );

    res.status(201).json({
      success: true,
      signalId: result.insertId,
      message: "Signal Created Successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};