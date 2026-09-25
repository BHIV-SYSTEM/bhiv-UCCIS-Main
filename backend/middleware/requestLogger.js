const fs = require("fs");
const path = require("path");

const requestLogger = (
  req,
  res,
  next
) => {

  const logPath = path.join(
    __dirname,
    "../logs/runtime.log"
  );

  const timestamp =
    new Date().toISOString();

  const logEntry =
    `[${timestamp}] ${req.method} ${req.originalUrl}\n`;

  fs.appendFileSync(
    logPath,
    logEntry
  );

  next();

};

module.exports = requestLogger;