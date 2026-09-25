const validTransitions = {
  SIGNAL_RECEIVED: [
    "INTELLIGENCE_GENERATED"
  ],

  INTELLIGENCE_GENERATED: [
    "ESCALATION_CREATED"
  ],

  ESCALATION_CREATED: [
    "GOVERNANCE_VISIBLE"
  ],

  GOVERNANCE_VISIBLE: [
    "ENFORCEMENT_ROUTED"
  ],

  ENFORCEMENT_ROUTED: [
    "EXECUTION_ACKNOWLEDGED"
  ],

  EXECUTION_ACKNOWLEDGED: [
    "RESOLUTION_CONFIRMED"
  ],

  RESOLUTION_CONFIRMED: [
    "BUCKET_PERSISTED"
  ],

  BUCKET_PERSISTED: [
    "REPLAY_VALIDATED"
  ]
};

function validateTransition(
  currentState,
  nextState
) {
  if (!currentState) {
    return nextState === "SIGNAL_RECEIVED";
  }

  return (
    validTransitions[currentState] &&
    validTransitions[currentState].includes(
      nextState
    )
  );
}

module.exports = {
  validateTransition
};