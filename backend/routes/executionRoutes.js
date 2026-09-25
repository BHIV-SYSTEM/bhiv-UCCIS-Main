const express = require("express");
const router = express.Router();

const {
  executeAction,
  executionRequest
} = require("../controllers/executionController");

// MUST be functions
router.post("/execution/trigger", executeAction);
router.post("/execution/request", executionRequest);

module.exports = router;