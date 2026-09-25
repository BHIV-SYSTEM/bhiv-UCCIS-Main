const mongoose = require("mongoose");

const replaySchema = new mongoose.Schema({
  event: String,
  timestamp: String,
  status: String
});

module.exports = mongoose.model("Replay", replaySchema);