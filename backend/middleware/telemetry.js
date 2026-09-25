module.exports =
(req, res, next) => {

  req.telemetry = {

    memory:
      process.memoryUsage()
        .heapUsed,

    rss:
      process.memoryUsage()
        .rss,

    uptime:
      process.uptime(),

    timestamp:
      new Date()

  };

  next();

};