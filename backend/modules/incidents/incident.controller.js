const incidentService =
  require("./incident.service");

exports.createIncident =
  async (req, res) => {
    try {
      const incident =
        await incidentService.create(
          req.body
        );

      res.status(201).json(
        incident
      );
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

exports.getIncidents =
  async (req, res) => {
    try {
      const incidents =
        await incidentService.getAll();

      res.json(incidents);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };