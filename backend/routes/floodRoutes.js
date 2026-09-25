const express = require("express");
const router = express.Router();

router.post("/flood/execute", (req, res) => {
  const { event_id, severity } = req.body;

  return res.json({
    success: true,
    message: "Flood scenario executed",
    incident: {
      event_id,
      severity
    },
    phases: [
      { phase: 1, name: "Detection", status: "COMPLETED" },
      { phase: 2, name: "Alert", status: "COMPLETED" },
      { phase: 3, name: "Escalation", status: severity === "HIGH" ? "TRIGGERED" : "COMPLETED" },
      { phase: 4, name: "Response", status: "ACTIVE" },
      { phase: 5, name: "Recovery", status: "PENDING" }
    ]
  });
});

module.exports = router;