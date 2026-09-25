exports.getTelemetry = async (req, res) => {
  res.json({
    activeAlerts: 12,
    operators: 45,
    heartbeat: "ACTIVE"
  });
};