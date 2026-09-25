const TraceGenerator =
  require("../runtime/TraceGenerator");

const traceMiddlewareTask36 =
  (req, res, next) => {
    req.traceId =
      TraceGenerator.generateTraceId();

    next();
  };

module.exports =
  traceMiddlewareTask36;