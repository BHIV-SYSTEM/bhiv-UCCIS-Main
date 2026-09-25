function createRequest(intelligence) {

  const request = {

    governance_id:
      "GOV-" + Date.now(),

    dominant_domain:
      intelligence.dominant_domain,

    final_score:
      intelligence.final_score,

    final_level:
      intelligence.final_level,

    requested_action:
      intelligence.final_level === "HIGH"
        ? "EMERGENCY_RESPONSE"
        : intelligence.final_level === "MEDIUM"
        ? "MONITOR"
        : "NORMAL",

    created_at:
      Date.now()
  };

  return request;
}

module.exports = {
  createRequest
};