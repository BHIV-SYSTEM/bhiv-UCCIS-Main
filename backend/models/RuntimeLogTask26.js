const mongoose = require("mongoose");

const runtimeSchema = new mongoose.Schema(
  {
    module: String,
    message: String,
    level: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { collection: "runtime_logs" }
);

module.exports = mongoose.model("RuntimeLog", runtimeSchema);