module.exports = () => {

  return {

    uptime:
      process.uptime(),

    memoryUsage:
      process.memoryUsage()
        .heapUsed,

    rss:
      process.memoryUsage().rss,

    cpuUsage:
      process.cpuUsage().user,

    timestamp:
      new Date()

  };

};