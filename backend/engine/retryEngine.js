function handleRetry(snapshot) {

  const retries =
    snapshot.retry_count || 0;

  // max retry = 3
  if (retries >= 3) {

    return {
      lifecycle_state:
        "REJECTED",

      rejection_reason:
        "Maximum retries exceeded",

      retry_count: retries
    };
  }

  return {

    lifecycle_state:
      "RETRY",

    retry_reason:
      "Retry initiated",

    retry_count:
      retries + 1
  };
}

module.exports = {
  handleRetry
};