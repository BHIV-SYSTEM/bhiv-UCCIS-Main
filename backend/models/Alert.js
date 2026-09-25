const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  title: String,
  severity: String,
  department: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Alert", alertSchema);