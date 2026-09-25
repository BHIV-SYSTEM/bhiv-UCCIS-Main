const express = require("express");

const router = express.Router();

const replayControllerTask27 =
require("../controllers/replayControllerTask27");

router.post(
  "/generate",
  replayController.generateReplay
);

module.exports = router;