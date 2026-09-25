exports.getDashboard = async (req, res) => {
  try {
    res.status(200).json({
      success: true,

      summary: {
        signals: 12,
        telemetry: 25,
        incidents: 10,
        escalations: 12,
        replay: 18,
        evidence: 32
      },

      runtimeChain: [
        {
          layer: "Signal",
          status: "SUCCESS"
        },
        {
          layer: "Telemetry",
          status: "SUCCESS"
        },
        {
          layer: "Incident",
          status: "SUCCESS"
        },
        {
          layer: "Escalation",
          status: "SUCCESS"
        },
        {
          layer: "Replay",
          status: "SUCCESS"
        },
        {
          layer: "Evidence",
          status: "SUCCESS"
        }
      ],

      traceId: req.traceId
    });
  } catch (error) {
    res.status(500).json(error);
  }
};