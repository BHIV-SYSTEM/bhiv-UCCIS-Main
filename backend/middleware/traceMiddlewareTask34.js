const generateTraceId = require("../utils/traceGeneratorTask34");

const traceMiddlewareTask34 = (
  req,
  res,
  next
) => {
  req.traceId = generateTraceId();

  next();
};

module.exports = traceMiddlewareTask34;