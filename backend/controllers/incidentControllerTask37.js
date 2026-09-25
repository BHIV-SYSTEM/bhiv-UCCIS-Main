const IncidentTask37 =
  require("../models/IncidentTask37");

exports.getIncidents =
  async (req, res) => {
    const incidents =
      await IncidentTask37.find();

    res.json(incidents);
  };

exports.createIncident =
  async (req, res) => {
    const incident =
      await IncidentTask37.create(
        req.body
      );

    res.status(201).json(
      incident
    );
  };