function validateGovernanceBoundary(
  action
) {
  const forbiddenActions = [
    "EXECUTE_ENFORCEMENT",
    "MODIFY_ENFORCEMENT_OUTCOME",
    "BYPASS_GOVERNANCE_VALIDATION"
  ];

  return !forbiddenActions.includes(
    action
  );
}

module.exports = {
  validateGovernanceBoundary
};