const telemetryService =
require("./telemetry.service");

exports.generate =
async (req, res) => {

  try {

    const telemetry =
      await telemetryService.generate(
        req.body.signalId
      );

    res.status(201).json({
      success: true,
      data: telemetry
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

exports.getTelemetry =
async (req, res) => {

  try {

    const data =
      await telemetryService.findAll();

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};