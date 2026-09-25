const express = require("express");

const router = express.Router();

const {
  getAnalytics,
  createMetric
} = require("../controllers/analyticsController");

router.get("/", getAnalytics);
router.post("/", createMetric);

module.exports = router;