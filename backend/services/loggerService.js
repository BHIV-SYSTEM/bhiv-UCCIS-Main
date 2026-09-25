const fs = require("fs");

const writeRuntimeLog = (message) => {

  const log =
    `[${new Date().toISOString()}] ${message}\n`;

  fs.appendFileSync(
    "./runtime_logs/runtime.log",
    log
  );
};

const writeReplayLog = (message) => {

  const log =
    `[${new Date().toISOString()}] ${message}\n`;

  fs.appendFileSync(
    "./runtime_logs/replay.log",
    log
  );
};

const writeEntropyLog = (message) => {

  const log =
    `[${new Date().toISOString()}] ${message}\n`;

  fs.appendFileSync(
    "./runtime_logs/entropy.log",
    log
  );
};

module.exports = {
  writeRuntimeLog,
  writeReplayLog,
  writeEntropyLog
};