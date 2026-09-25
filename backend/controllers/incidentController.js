const IncidentTask27 = require("../models/IncidentTask27");
const EscalationService = require("../services/escalationService");

exports.createIncident = async (req, res) => {
  try {

    const { eventId, severity } = req.body;

    const incident =
      await Incident.create(
        eventId,
        severity
      );

    await EscalationService.create(
      incident.insertId
    );

    res.status(201).json({
      success: true,
      incidentId: incident.insertId
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

exports.getIncidents = async (req, res) => {
  try {

    const incidents =
      await Incident.getAll();

    res.json(incidents);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};