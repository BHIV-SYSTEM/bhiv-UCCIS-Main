function validatePayload(payload) {

  if (!payload) {

    return {
      valid: false,
      reason: "EMPTY_PAYLOAD"
    };
  }

  if (!payload.signal_id) {

    return {
      valid: false,
      reason: "MISSING_SIGNAL_ID"
    };
  }

  if (!payload.trace_id) {

    return {
      valid: false,
      reason: "MISSING_TRACE_ID"
    };
  }

  if (!payload.timestamp) {

    return {
      valid: false,
      reason: "MISSING_TIMESTAMP"
    };
  }

  return {
    valid: true
  };
}

module.exports =
validatePayload;