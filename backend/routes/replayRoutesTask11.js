const express = require("express");

const router = express.Router();

const replayController = require("../controllers/replayController");

router.get(
  "/:trace_id",
  replayController.replayTrace
);

router.get(
  "/timeline/:zone_id",
  replayController.zoneTimeline
);

router.get(
  "/reconstruct/:trace_id",
  replayController.reconstruct
);

module.exports = router;