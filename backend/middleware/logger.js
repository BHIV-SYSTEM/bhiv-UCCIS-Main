const fs = require("fs");
const path = require("path");

const logFile = path.join(
  __dirname,
  "../logs/runtime.log"
);

module.exports = (req, res, next) => {

  const log = `
[${new Date().toISOString()}]
${req.method}
${req.originalUrl}
`;

  fs.appendFileSync(logFile, log);

  next();
};