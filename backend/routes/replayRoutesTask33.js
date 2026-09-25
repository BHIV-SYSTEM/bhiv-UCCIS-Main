const express = require("express");
const router = express.Router();

const {
  getReplayEvents,
  getReplayByTrace,
  getEvidenceByTrace
} = require("../controllers/replayControllerTask33");

router.get("/", getReplayEvents);

router.get(
  "/trace/:traceId",
  getReplayByTrace
);

router.get(
  "/evidence/:traceId",
  getEvidenceByTrace
);

module.exports = router;