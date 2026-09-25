exports.handleExecutionRequest = (req, res) => {
  const { trace_id, zone_id, action, domain } = req.body;

  // 🔥 ONLY LOG (NO REAL EXECUTION)
  console.log("Execution Request Received:", {
    trace_id,
    zone_id,
    action,
    domain
  });

  res.json({
    status: "RECEIVED",
    message: "Execution request queued",
    trace_id
  });
};