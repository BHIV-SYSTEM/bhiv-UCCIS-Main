const crypto = require("crypto");

const generateTraceId = () => {
  return `TRACE-${Date.now()}-${crypto
    .randomBytes(4)
    .toString("hex")}`;
};

const traceMiddlewareTask33 = (
  req,
  res,
  next
) => {

  let traceId =
    req.headers["x-trace-id"];

  if (!traceId) {
    traceId = generateTraceId();
  }

  req.traceId = traceId;

  res.setHeader(
    "x-trace-id",
    traceId
  );

  next();
};

module.exports = traceMiddlewareTask33;