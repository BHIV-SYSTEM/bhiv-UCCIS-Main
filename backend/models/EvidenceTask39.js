const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema(
  {
    evidenceId: {
      type: String,
      required: true,
      unique: true
    },

    traceId: {
      type: String,
      required: true
    },

    replayId: {
      type: String,
      required: true
    },

    status: {
      type: String,
      default: "Stored"
    },

    location: {
      type: String,
      default: "/evidence/runtime"
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "Evidence",
    evidenceSchema
  );