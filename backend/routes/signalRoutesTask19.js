const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.json([

    {
      signal: "Flood Detection",
      telemetry: "Water Level Rising",
      escalation: "District Escalated",
      replay: "Replay Generated",
      status: "Critical"
    }

  ]);

});

module.exports = router;