function consumeSignal(upstreamSignal) {
  /*
    EXPECTED FORMAT (from Diwakar pipeline):

    {
      trace_id: string (MANDATORY - DO NOT TOUCH),
      zone_id: number,
      timestamp: ISO,
      payload: {
        traffic_score,
        water_score,
        flood_score,
        waste_score,
        complaint_score
      },
      domain_events: [],
      signal_quality: {
        freshness,
        completeness,
        noise_level
      }
    }
  */

  if (!upstreamSignal || !upstreamSignal.trace_id) {
    throw new Error("INVALID_TRACE: Missing upstream trace");
  }

  return {
    trace_id: upstreamSignal.trace_id,
    zone_id: upstreamSignal.zone_id,
    timestamp: upstreamSignal.timestamp,

    data: upstreamSignal.payload,
    domain_events: upstreamSignal.domain_events || [],
    signal_quality: upstreamSignal.signal_quality || {}
  };
}

module.exports = {
  consumeSignal
};