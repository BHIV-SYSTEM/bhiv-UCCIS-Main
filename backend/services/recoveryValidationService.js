function validateReplayRecovery(
  failures,
  recoveries
) {
  return {
    recovery_possible:
      failures.length === recoveries.length,

    failures_detected:
      failures.length,

    recoveries_completed:
      recoveries.length
  };
}

module.exports = {
  validateReplayRecovery
};