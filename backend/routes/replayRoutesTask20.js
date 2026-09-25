const express = require("express");

const router = express.Router();

/*
=====================================================
REPLAY STORE
=====================================================
*/

const replayStore = require("../data/replayStore");

/*
=====================================================
GET FULL REPLAY TIMELINE
=====================================================
*/

router.get("/", (req, res) => {
  res.json({
    replayTimeline: replayStore
  });
});

/*
=====================================================
GET TOTAL EVENTS
=====================================================
*/

router.get("/count", (req, res) => {
  res.json({
    totalReplayEvents: replayStore.length
  });
});

/*
=====================================================
GET LATEST EVENT
=====================================================
*/

router.get("/latest", (req, res) => {
  const latestEvent =
    replayStore[replayStore.length - 1] || null;

  res.json({
    latestEvent
  });
});

/*
=====================================================
ADD REPLAY EVENT MANUALLY
=====================================================
*/

router.post("/add", (req, res) => {
  const {
    event,
    severity,
    operator,
    district
  } = req.body;

  const replayEvent = {
    replayId: Date.now(),

    event: event || "UNKNOWN EVENT",

    severity: severity || "LOW",

    operator: operator || "SYSTEM",

    district: district || "UNKNOWN",

    timestamp: new Date().toISOString()
  };

  replayStore.push(replayEvent);

  res.json({
    message: "Replay Event Added Successfully",

    replayEvent,

    replayTimeline: replayStore
  });
});

/*
=====================================================
CLEAR REPLAY TIMELINE
=====================================================
*/

router.post("/clear", (req, res) => {
  replayStore.length = 0;

  res.json({
    message: "Replay Timeline Cleared",
    replayTimeline: replayStore
  });
});

module.exports = router;