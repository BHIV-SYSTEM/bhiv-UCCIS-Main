const evidenceService =
  require("./evidence.service");

exports.createEvidence =
  async (req, res) => {
    try {
      const evidence =
        await evidenceService.create(
          req.body
        );

      res.status(201).json(
        evidence
      );
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

exports.getEvidence =
  async (req, res) => {
    try {
      const evidence =
        await evidenceService.getAll();

      res.json(evidence);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };