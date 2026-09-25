const enforcementService = require(
  "../services/enforcementService"
);

function getEnforcement(req, res) {
  const data =
    enforcementService.getEnforcement(
      req.params.trace_id
    );

  res.json({
    success: true,
    enforcement: data
  });
}

function validateBoundary(req, res) {
  const data =
    enforcementService.validateBoundary(
      req.params.trace_id
    );

  res.json(data);
}

function reconstructEnforcement(
  req,
  res
) {
  const data =
    enforcementService.reconstructEnforcement(
      req.params.trace_id
    );

  res.json({
    success: true,
    reconstruction: data
  });
}

module.exports = {
  getEnforcement,
  validateBoundary,
  reconstructEnforcement
};