const concurrencyService = require(
  "../services/concurrencyService"
);

function getConcurrency(req, res) {
  const data =
    concurrencyService.getConcurrency(
      req.params.trace_id
    );

  res.json({
    success: true,
    concurrency: data
  });
}

function validateConcurrency(req, res) {
  const data =
    concurrencyService.validateConcurrency(
      req.params.trace_id
    );

  res.json(data);
}

function reconstructConcurrency(
  req,
  res
) {
  const data =
    concurrencyService.reconstructConcurrency(
      req.params.trace_id
    );

  res.json({
    success: true,
    reconstruction: data
  });
}

function operatorConsistency(
  req,
  res
) {
  const data =
    concurrencyService.operatorConsistency(
      req.params.trace_id
    );

  res.json(data);
}

module.exports = {
  getConcurrency,
  validateConcurrency,
  reconstructConcurrency,
  operatorConsistency
};