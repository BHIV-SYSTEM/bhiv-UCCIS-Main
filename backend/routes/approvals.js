const express = require("express");
const router = express.Router();

const Approval = require("../models/Approval");

router.post("/", (req, res) => {
  Approval.create(req.body, (err, id) => {
    res.json({
      success: true,
      id,
    });
  });
});

router.get("/", (req, res) => {
  Approval.getAll((err, rows) => {
    res.json(rows);
  });
});

module.exports = router;