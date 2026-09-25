exports.getIncidents = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      layer: "Incident",
      traceId: req.traceId,
      totalIncidents: 10,
      openIncidents: 4,
      resolvedIncidents: 6
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createIncident = async (req, res) => {
  try {
    const { incidentTitle, priority } = req.body;

    res.status(201).json({
      success: true,
      incidentTitle,
      priority,
      traceId: req.traceId
    });
  } catch (error) {
    res.status(500).json(error);
  }
};