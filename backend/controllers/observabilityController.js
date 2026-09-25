const observabilityService = require(
  "../services/observabilityService"
);

function getOverview(req, res) {
  const data =
    observabilityService.getObservabilityOverview();

  res.json({
    success: true,
    observability: data
  });
}

module.exports = {
  getOverview
};