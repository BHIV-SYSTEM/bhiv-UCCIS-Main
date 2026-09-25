function resolveLifecycle(request) {

  let state = "APPROVED";

  let reason = "Safe execution";

  // HIGH severity escalation
  if (
    request.final_level === "HIGH"
  ) {
    state = "ESCALATED";
    reason =
      "Critical urban condition";
  }

  // Medium severity hold
  if (
    request.final_level === "MEDIUM"
  ) {
    state = "HOLD";
    reason =
      "Awaiting governance review";
  }

  return {
    lifecycle_state: state,
    lifecycle_reason: reason
  };
}

module.exports = {
  resolveLifecycle
};