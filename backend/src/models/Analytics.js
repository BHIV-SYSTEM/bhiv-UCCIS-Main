const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema(
  {
    traceId: String,
    category: String,
    metricName: String,
    metricValue: Number
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Analytics",
  AnalyticsSchema
);