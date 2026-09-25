const mongoose = require("mongoose");

const EvidenceSchema = new mongoose.Schema(
  {
    evidenceId: String,
    traceId: String,
    replayId: String,
    fileName: String,
    fileType: String,
    storagePath: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Evidence",
  EvidenceSchema
);