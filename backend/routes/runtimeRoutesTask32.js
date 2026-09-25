const express = require("express");
const router = express.Router();

const {
  executeSignal
} = require("../controllers/runtimeControllerTask32");

router.post(
  "/execute-signal",
  executeSignal
);

module.exports = router;