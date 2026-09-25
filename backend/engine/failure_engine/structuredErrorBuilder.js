function buildStructuredError({

  type,
  message,
  trace_id,
  severity,
  source

}) {

  return {

    success: false,

    error: {

      type,

      message,

      severity,

      source,

      trace_id:
        trace_id || "TRACE_MISSING",

      timestamp:
        new Date(),

      replay_visible: true,

      audit_required: true
    }
  };
}

module.exports =
buildStructuredError;