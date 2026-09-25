const express = require("express");

const router = express.Router();

const SignalTask25 = require("../models/SignalTask25");

const telemetryEngine = require("../services/telemetryEngine");
const escalationEngine = require("../services/escalationEngine");
const replayEngineTask25 = require("../services/replayEngineTask25");
const dashboardPublisher = require("../services/dashboardPublisher");
const logger = require("../services/runtimeLogger");

router.post("/", (req, res) => {
  Signal.create(req.body, (err, signalId) => {
    if (err) {
      return res.status(500).json(err);
    }

    telemetryEngine.generate(signalId);

    escalationEngine.evaluate({
      ...req.body,
      id: signalId,
    });

    dashboardPublisher.publish(req.body);

    replayEngine.record(signalId);

    logger.writeLog(
      "backend",
      `Signal stored successfully ${signalId}`
    );

    res.json({
      success: true,
      signalId,
    });
  });
});

router.get("/", (req, res) => {
  Signal.getAll((err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(rows);
  });
});

module.exports = router;