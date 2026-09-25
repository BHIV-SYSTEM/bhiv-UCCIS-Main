const signalSchema = {
  required: [
    "trace_id",
    "zone_id",
    "timestamp",
    "payload",
    "signal_quality"
  ],

  payload_required: [
    "traffic_score",
    "water_score",
    "flood_score",
    "waste_score",
    "complaint_score"
  ]
};

module.exports = signalSchema;