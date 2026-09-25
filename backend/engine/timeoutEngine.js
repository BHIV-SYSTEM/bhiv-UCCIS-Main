function checkTimeout(request) {

  const now = Date.now();

  const elapsed =
    now - request.created_at;

  // 5 second timeout simulation
  if (elapsed > 5000) {

    return {
      timeout: true,
      state: "RETRY",
      reason:
        "Governance response timeout"
    };
  }

  return {
    timeout: false
  };
}

module.exports = {
  checkTimeout
};