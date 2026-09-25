const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventController");

router.post("/ingest", controller.ingestEvent);
router.get("/", controller.getEvents);
router.get("/timeline/:trace_id", controller.getTimeline);

module.exports = router;