const express = require("express");

const router = express.Router();

const {
  getGovernanceStatus
} = require("../controllers/governanceController");

router.get("/status", getGovernanceStatus);

module.exports = router;