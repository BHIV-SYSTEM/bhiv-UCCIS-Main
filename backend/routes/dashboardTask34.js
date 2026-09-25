const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    signals: 12,
    telemetry: 25,
    incidents: 10,
    escalations: 12,
    replay: 18,
    evidence: 32
  });
});

module.exports = router;