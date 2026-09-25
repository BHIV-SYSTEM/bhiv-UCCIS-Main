const observabilityService =
require(
"../services/observability/observabilityService"
);

exports.getObservability =
(req, res) => {

res.json(
observabilityService.getSystemHealth()
);

};