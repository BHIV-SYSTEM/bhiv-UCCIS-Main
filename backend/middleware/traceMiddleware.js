const { v4: uuidv4 } = require("uuid");

module.exports = (req, res, next) => {

  if (!req.headers["x-trace-id"]) {
    req.trace_id = uuidv4();
  } else {
    req.trace_id = req.headers["x-trace-id"];
  }

  next();
};