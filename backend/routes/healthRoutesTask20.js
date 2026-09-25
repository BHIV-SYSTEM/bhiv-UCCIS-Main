const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    backend: "UP",
    replay: "UP",
    telemetry: "UP",
    frontend: "CONNECTED"
  });
});

module.exports = router;