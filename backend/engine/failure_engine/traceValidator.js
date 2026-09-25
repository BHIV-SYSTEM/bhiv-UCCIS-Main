function validateTrace(trace_id) {

  return (
    trace_id &&
    trace_id.startsWith("TRACE-")
  );
}

module.exports =
validateTrace;