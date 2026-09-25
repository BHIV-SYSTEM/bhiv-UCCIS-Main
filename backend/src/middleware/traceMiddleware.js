const { v4: uuidv4 } = require("uuid");

module.exports = (req, res, next) => {
  req.traceId = uuidv4();

  res.setHeader("x-trace-id", req.traceId);

  next();
};