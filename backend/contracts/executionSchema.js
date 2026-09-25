const executionSchema = {
  required: [
    "trace_id",
    "zone_id",
    "previous_state",
    "current_state",
    "reason",
    "confidence_score"
  ]
};

module.exports = executionSchema;