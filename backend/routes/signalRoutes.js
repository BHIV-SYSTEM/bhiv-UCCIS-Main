const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "signal route working" });
});

module.exports = router;