const observabilityService =
  require("./observability.service");

exports.getMetrics =
  (req, res) => {
    res.json(
      observabilityService.getMetrics()
    );
  };