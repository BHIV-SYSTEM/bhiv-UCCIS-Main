const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.json({
    status: "Healthy",
    runtime: "Operational",
    uptime: process.uptime(),
    traceId: req.traceId,
    timestamp: new Date()
  });

});

module.exports = router;