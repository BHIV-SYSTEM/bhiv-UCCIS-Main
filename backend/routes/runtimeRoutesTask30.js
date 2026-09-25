const express = require("express");
const router = express.Router();

const {
  executeFloodScenario
} = require("../controllers/runtimeControllerTask30");

router.get(
  "/flood-scenario",
  executeFloodScenario
);

module.exports = router;