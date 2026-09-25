const telemetryService =
require(
"../services/telemetry/telemetryService"
);

exports.getTelemetry =
(req, res) => {

res.json(
telemetryService.getTelemetrySummary()
);

};