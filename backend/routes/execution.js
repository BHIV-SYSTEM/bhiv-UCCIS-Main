const express = require("express");
const router = express.Router();

const { handleExecutionRequest } = require("../controllers/executionControllerTask5");

// ✅ TANTRA HOOK ENDPOINT
router.post("/execution/request", handleExecutionRequest);

module.exports = router;