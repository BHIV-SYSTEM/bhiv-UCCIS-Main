const mongoose = require("mongoose");

const EvidenceSchema =
  new mongoose.Schema(
    {
      evidenceId: String,

      traceId: String,

      fileName: String,

      type: String,

      uploadedBy: String
    },
    {
      timestamps: true
    }
  );

module.exports = mongoose.model(
  "Evidence",
  EvidenceSchema
);