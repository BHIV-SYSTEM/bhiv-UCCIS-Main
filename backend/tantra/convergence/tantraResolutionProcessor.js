function tantraResolutionProcessor(
  enforcement
) {

  return {

    trace_id:
      enforcement.trace_id,

    stage:
      "RESOLUTION",

    resolution_status:
      enforcement.enforcement_action
      === "FIELD_RESPONSE_DEPLOYED"
        ? "STABILIZED"
        : "PENDING",

    timestamp:
      new Date()
  };
}

module.exports =
tantraResolutionProcessor;