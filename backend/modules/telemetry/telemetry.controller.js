const telemetryService =
  require("./telemetry.service");

exports.createTelemetry =
  async (req, res) => {
    try {
      const telemetry =
        await telemetryService.create(
          req.body
        );

      res.status(201).json(
        telemetry
      );
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

exports.getTelemetry =
  async (req, res) => {
    try {
      const telemetry =
        await telemetryService.getAll();

      res.json(telemetry);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };