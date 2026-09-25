const failureService = require(
  "../services/failureService"
);

function getFailures(req, res) {
  const data =
    failureService.getFailureReplay(
      req.params.trace_id
    );

  res.json({
    success: true,
    failures: data
  });
}

function getRecoveries(req, res) {
  const data =
    failureService.getRecoveryReplay(
      req.params.trace_id
    );

  res.json({
    success: true,
    recoveries: data
  });
}

function validateFailures(req, res) {
  const data =
    failureService.validateFailures(
      req.params.trace_id
    );

  res.json(data);
}

module.exports = {
  getFailures,
  getRecoveries,
  validateFailures
};