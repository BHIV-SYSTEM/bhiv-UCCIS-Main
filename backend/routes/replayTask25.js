const express = require("express");
const router = express.Router();

const ReplaySession = require("../models/ReplaySession");

router.get("/", (req, res) => {
  ReplaySession.getAll((err, rows) => {
    res.json(rows);
  });
});

module.exports = router;