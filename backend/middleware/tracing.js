const {
  v4: uuidv4
} = require("uuid");

module.exports =
(req, res, next) => {

  req.traceId =
    `TRACE-${uuidv4()}`;

  res.setHeader(
    "X-Trace-Id",
    req.traceId
  );

  next();

};