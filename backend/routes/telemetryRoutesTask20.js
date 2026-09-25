const express = require("express");

const router = express.Router();

/*
=====================================================
TELEMETRY STORE
=====================================================
*/

const telemetryStore = require("../data/telemetryStore");

/*
=====================================================
GET TELEMETRY STATUS
=====================================================
*/

router.get("/", (req, res) => {
  res.json({
    telemetry: telemetryStore
  });
});

/*
=====================================================
GET HEARTBEAT
=====================================================
*/

router.get("/heartbeat", (req, res) => {
  res.json({
    heartbeat: telemetryStore.heartbeat,
    runtimeStatus: telemetryStore.runtimeStatus,
    timestamp: new Date().toISOString()
  });
});

/*
=====================================================
GET INCIDENT COUNT
=====================================================
*/

router.get("/incidents", (req, res) => {
  res.json({
    incidents: telemetryStore.incidents,
    escalationRisk: telemetryStore.escalationRisk
  });
});

/*
=====================================================
GET ENTROPY STATUS
=====================================================
*/

router.get("/entropy", (req, res) => {
  res.json({
    entropy: telemetryStore.entropy,
    runtimeStatus: telemetryStore.runtimeStatus
  });
});

/*
=====================================================
UPDATE TELEMETRY MANUALLY
=====================================================
*/

router.post("/update", (req, res) => {
  const {
    operators,
    incidents,
    entropy,
    heartbeat,
    escalationRisk,
    runtimeStatus
  } = req.body;

  if (operators !== undefined) {
    telemetryStore.operators = operators;
  }

  if (incidents !== undefined) {
    telemetryStore.incidents = incidents;
  }

  if (entropy !== undefined) {
    telemetryStore.entropy = entropy;
  }

  if (heartbeat !== undefined) {
    telemetryStore.heartbeat = heartbeat;
  }

  if (escalationRisk !== undefined) {
    telemetryStore.escalationRisk = escalationRisk;
  }

  if (runtimeStatus !== undefined) {
    telemetryStore.runtimeStatus = runtimeStatus;
  }

  res.json({
    message: "Telemetry Updated Successfully",
    telemetry: telemetryStore
  });
});

module.exports = router;