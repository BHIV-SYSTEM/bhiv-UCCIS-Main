const crypto = require("crypto");

const generateTraceId = () => {
  return `TRACE-${Date.now()}-${crypto
    .randomBytes(4)
    .toString("hex")}`;
};

module.exports = generateTraceId;