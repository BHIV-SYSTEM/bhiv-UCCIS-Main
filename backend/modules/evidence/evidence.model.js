const mongoose =
  require("mongoose");

const EvidenceSchema =
  new mongoose.Schema(
    {
      traceId: String,
      type: String,
      content: String,
      source: String
    },
    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(
    "Evidence",
    EvidenceSchema
  );