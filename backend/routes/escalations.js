const express = require("express");
const router = express.Router();

const Escalation = require("../models/Escalation");

router.get("/", (req, res) => {
  Escalation.getAll((err, rows) => {
    res.json(rows);
  });
});

module.exports = router;