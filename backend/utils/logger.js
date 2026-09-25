const fs = require("fs");
const path = require("path");

const logPath = path.join(
  __dirname,
  "../logs/runtime.log"
);

const logger = (message) => {
  const log = `[${new Date().toISOString()}] ${message}\n`;

  console.log(log);

  fs.appendFileSync(logPath, log);
};

module.exports = logger;