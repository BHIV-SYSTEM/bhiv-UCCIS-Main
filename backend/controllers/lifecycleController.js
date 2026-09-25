const lifecycleService = require(
  "../services/lifecycleService"
);

function getLifecycle(req, res) {
  const data =
    lifecycleService.getLifecycle(
      req.params.trace_id
    );

  res.json({
    success: true,
    lifecycle: data
  });
}

function validateLifecycle(req, res) {
  const data =
    lifecycleService.validateLifecycle(
      req.params.trace_id
    );

  res.json(data);
}

function reconstructLifecycle(req, res) {
  const data =
    lifecycleService.reconstructLifecycle(
      req.params.trace_id
    );

  res.json({
    success: true,
    reconstruction: data
  });
}

module.exports = {
  getLifecycle,
  validateLifecycle,
  reconstructLifecycle
};