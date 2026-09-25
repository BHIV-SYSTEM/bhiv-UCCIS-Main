const TelemetryTask30 = require("../models/TelemetryTask30");

exports.getTelemetry = async (req, res) => {
  try {

    const [rows] = await TelemetryTask30.getAll();

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