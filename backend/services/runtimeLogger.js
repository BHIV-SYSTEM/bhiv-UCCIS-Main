const fs = require("fs");
const path = require("path");
const RuntimeLog = require("../models/RuntimeLog");

const logDir = path.join(__dirname, "../runtime_logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function writeLog(source, message) {
  const timestamp = new Date().toISOString();

  const filePath = path.join(logDir, `${source}.log`);

  const line = `[${timestamp}] ${message}\n`;

  fs.appendFileSync(filePath, line);

  RuntimeLog.create(
    {
      source,
      message,
    },
    () => {}
  );
}

module.exports = {
  writeLog,
};