const express = require("express");
const router = express.Router();

const IncidentTask25 = require("../models/IncidentTask25");

router.post("/", (req, res) => {
  Incident.create(req.body, (err, id) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      success: true,
      id,
    });
  });
});

router.get("/", (req, res) => {
  Incident.getAll((err, rows) => {
    res.json(rows);
  });
});

module.exports = router;