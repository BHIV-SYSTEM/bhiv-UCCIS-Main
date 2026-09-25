const express = require("express");
const router = express.Router();

const {
  getCommandCenter,
  getExecutiveSummary
} = require("../controllers/commandCenterController");

router.get("/", getCommandCenter);

router.get(
  "/executive-summary",
  getExecutiveSummary
);

module.exports = router;