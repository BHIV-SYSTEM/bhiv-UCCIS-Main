const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

/* ===========================
   IMPORTS
=========================== */

const {
  generateReplay,
  getLineage
} = require("../replay-engine/replayCore");

const collectTelemetry =
  require("../telemetry/telemetryCore");

/* ===========================
   LOG WRITER
=========================== */

function writeLog(fileName, message) {

  const logDir = path.join(
    __dirname,
    "..",
    "runtime_logs"
  );

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logPath = path.join(
    logDir,
    fileName
  );

  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, "");
  }

  const timestamp = new Date().toISOString();

  fs.appendFileSync(
    logPath,
    `[${timestamp}] ${message}\n`
  );

}

/* ===========================
   GENERATE REPLAY
=========================== */

router.get("/generate", (req, res) => {

  const randomDelay =
    Math.floor(Math.random() * 3000);

  setTimeout(() => {

    const replay =
      generateReplay("SIGNAL_RECEIVED");

    writeLog(
      "runtime.log",
      "Signal received"
    );

    writeLog(
      "replay.log",
      `Replay generated ${replay.id}`
    );

    if (replay.corruptionAttempt) {

      writeLog(
        "corruption.log",
        `Corruption detected on replay ${replay.id}`
      );

    }

    if (replay.recoveryTriggered) {

      writeLog(
        "recovery.log",
        "Recovery sequencing triggered"
      );

    }

    if (replay.divergence) {

      writeLog(
        "divergence.log",
        "Replay divergence detected"
      );

    }

    if (!replay.reconstructionFailed) {

      writeLog(
        "recovery.log",
        "Replay reconstruction completed"
      );

    } else {

      writeLog(
        "recovery.log",
        "Replay reconstruction failed"
      );

    }

    if (replay.governanceVisible) {

      writeLog(
        "runtime.log",
        "Governance visibility active"
      );

    }

    writeLog(
      "runtime.log",
      "Audit continuity active"
    );

    res.json(replay);

  }, randomDelay);

});

/* ===========================
   LINEAGE
=========================== */

router.get("/lineage", (req, res) => {

  res.json(getLineage());

});

/* ===========================
   TELEMETRY
=========================== */

router.get("/telemetry", (req, res) => {

  res.json(
    collectTelemetry()
  );

});

module.exports = router;