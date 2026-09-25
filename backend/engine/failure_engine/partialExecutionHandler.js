function handlePartialExecution(
  executionFlow
) {

  const failedStages =
    executionFlow.filter(
      stage =>
        stage.status === "FAILED"
    );

  return {

    partially_failed:
      failedStages.length > 0,

    failed_stages:
      failedStages
  };
}

module.exports =
handlePartialExecution;