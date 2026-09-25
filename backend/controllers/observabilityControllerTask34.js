exports.getObservability = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      traceId: req.traceId,

      metrics: {
        cpu: "68%",
        memory: "74%",
        network: "Healthy"
      },

      runtime: {
        signals: "Healthy",
        telemetry: "Healthy",
        incidents: "Healthy",
        escalations: "Healthy",
        replay: "Healthy",
        evidence: "Healthy"
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
};