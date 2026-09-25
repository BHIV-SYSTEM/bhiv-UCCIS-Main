exports.getTelemetry = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      layer: "Telemetry",
      traceId: req.traceId,
      totalMetrics: 25,
      healthyMetrics: 20,
      warningMetrics: 5
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createTelemetry = async (req, res) => {
  try {
    const { metricName, value } = req.body;

    res.status(201).json({
      success: true,
      metricName,
      value,
      traceId: req.traceId
    });
  } catch (error) {
    res.status(500).json(error);
  }
};