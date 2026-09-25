const signalService =
  require("./signal.service");

exports.createSignal =
  async (req, res) => {
    try {
      const signal =
        await signalService.createSignal(
          req.body
        );

      res.status(201).json(signal);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

exports.getSignals =
  async (req, res) => {
    try {
      const signals =
        await signalService.getSignals();

      res.json(signals);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

exports.getSignal =
  async (req, res) => {
    try {
      const signal =
        await signalService.getSignal(
          req.params.traceId
        );

      res.json(signal);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };