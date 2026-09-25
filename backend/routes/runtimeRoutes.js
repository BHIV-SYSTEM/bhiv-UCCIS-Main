const express = require("express");

const router = express.Router();

/*
=====================================================
DATA STORES
=====================================================
*/

const telemetryStore = require("../data/telemetryStore");

const replayStore = require("../data/replayStore");

const escalationStore = require("../data/escalationStore");

const auditStore = require("../data/auditStore");

/*
=====================================================
SIGNAL SERVICE
=====================================================
*/

const generateSignal = require("../services/signalService");

/*
=====================================================
FULL OPERATIONAL FLOW
=====================================================
SIGNAL GENERATED
→ TELEMETRY UPDATED
→ OPERATIONAL INTELLIGENCE UPDATED
→ ESCALATION GENERATED
→ DASHBOARD REFLECTS CHANGE
→ REPLAY RECORDS EVENT
→ RUNTIME STATUS UPDATED
→ AUDIT LOG PRODUCED
=====================================================
*/

router.post("/generate-signal", (req, res) => {
  const signal = generateSignal();

  res.json({
    success: true,

    message: "FULL OPERATIONAL FLOW EXECUTED",

    operationalChain: [
      "Signal Generated",
      "Telemetry Updated",
      "Operational Intelligence Updated",
      "Escalation Generated",
      "Dashboard Reflects Change",
      "Replay Records Event",
      "Runtime Status Updated",
      "Audit Log Produced"
    ],

    signal,

    telemetry: telemetryStore,

    escalations: escalationStore,

    replayTimeline: replayStore,

    auditLogs: auditStore
  });
});

/*
=====================================================
RUNTIME STATUS
=====================================================
*/

router.get("/status", (req, res) => {
  res.json({
    runtime: "ACTIVE",

    telemetry: telemetryStore,

    replay: replayStore,

    escalations: escalationStore,

    audit: auditStore
  });
});

/*
=====================================================
RESET SYSTEM
=====================================================
*/

router.post("/reset", (req, res) => {
  telemetryStore.operators = 184;
  telemetryStore.incidents = 12;
  telemetryStore.entropy = 12;
  telemetryStore.heartbeat = "ACTIVE";
  telemetryStore.escalationRisk = "LOW";
  telemetryStore.runtimeStatus = "STABLE";

  replayStore.length = 0;

  escalationStore.length = 0;

  auditStore.length = 0;

  res.json({
    message: "SYSTEM RESET COMPLETE",

    telemetry: telemetryStore,

    replay: replayStore,

    escalations: escalationStore,

    audit: auditStore
  });
});

module.exports = router;