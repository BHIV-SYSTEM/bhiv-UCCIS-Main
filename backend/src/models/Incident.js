const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema(
  {
    incidentId: String,
    traceId: String,
    title: String,
    severity: String,
    status: {
      type: String,
      default: "OPEN"
    },
    description: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Incident",
  IncidentSchema
);