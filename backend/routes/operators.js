const express = require("express");
const router = express.Router();

const Operator = require("../models/Operator");

router.post("/", (req, res) => {
  Operator.create(req.body, (err, id) => {
    res.json({
      success: true,
      id,
    });
  });
});

router.get("/", (req, res) => {
  Operator.getAll((err, rows) => {
    res.json(rows);
  });
});

module.exports = router;