const express = require("express");
const router = express.Router();

const Decision = require("../models/Decision");

router.post("/", (req, res) => {
  Decision.create(req.body, (err, id) => {
    res.json({
      success: true,
      id,
    });
  });
});

router.get("/", (req, res) => {
  Decision.getAll((err, rows) => {
    res.json(rows);
  });
});

module.exports = router;