const express = require("express");
const router = express.Router();

const RuntimeLog = require("../models/RuntimeLog");

router.get("/", (req, res) => {
  RuntimeLog.getAll((err, rows) => {
    res.json(rows);
  });
});

module.exports = router;