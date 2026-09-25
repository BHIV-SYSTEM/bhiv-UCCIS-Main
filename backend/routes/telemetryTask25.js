const express = require("express");
const router = express.Router();

const TelemetryEvent = require("../models/TelemetryEvent");

router.get("/", (req, res) => {
  TelemetryEvent.getAll((err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(rows);
  });
});

module.exports = router;