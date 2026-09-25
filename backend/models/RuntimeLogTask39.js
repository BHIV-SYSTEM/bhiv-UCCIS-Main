const mongoose = require("mongoose");

const RuntimeLogSchema = new mongoose.Schema(
  {
    logId: {
      type: String,
      required: true,
      unique: true
    },

    traceId: {
      type: String,
      default: null
    },

    service: {
      type: String,
      required: true
    },

    level: {
      type: String,
      enum: [
        "INFO",
        "WARN",
        "ERROR",
        "DEBUG"
      ],
      default: "INFO"
    },

    message: {
      type: String,
      required: true
    },

    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "RuntimeLog",
  RuntimeLogSchema
);