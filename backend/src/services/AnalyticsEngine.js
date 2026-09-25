const Analytics =
  require("../models/Analytics");

class AnalyticsEngine {

  async process(traceId) {

    const metric =
      await Analytics.create({
        traceId,
        category: "Runtime",
        metricName: "ExecutionTime",
        metricValue:
          Math.floor(Math.random() * 100)
      });

    return metric;
  }

}

module.exports =
  new AnalyticsEngine();