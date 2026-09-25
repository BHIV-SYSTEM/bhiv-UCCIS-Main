const escalationService =
  require("./escalation.service");

exports.createEscalation =
  async (req, res) => {
    try {
      const escalation =
        await escalationService.create(
          req.body
        );

      res.status(201).json(
        escalation
      );
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

exports.getEscalations =
  async (req, res) => {
    try {
      const data =
        await escalationService.getAll();

      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };