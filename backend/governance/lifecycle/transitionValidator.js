const allowedTransitions = {

  HOLD: [
    "APPROVED",
    "REJECTED",
    "ESCALATED"
  ],

  RETRY: [
    "APPROVED",
    "REJECTED"
  ],

  ESCALATED: [
    "APPROVED",
    "REJECTED"
  ],

  APPROVED: [],

  REJECTED: []
};

function validateTransition(
  currentState,
  nextState
) {

  const allowed =
    allowedTransitions[currentState] || [];

  return allowed.includes(nextState);
}

module.exports =
validateTransition;