const intelligenceSchema = {
  required: [
    "trace_id",
    "zone_id",
    "timestamp",
    "previous_state",
    "current_state",
    "risk_score",
    "confidence_score",
    "decision"
  ],

  valid_states: ["LOW", "MEDIUM", "HIGH"],
  valid_decisions: ["NORMAL", "MONITOR", "ALERT"]
};

module.exports = intelligenceSchema;