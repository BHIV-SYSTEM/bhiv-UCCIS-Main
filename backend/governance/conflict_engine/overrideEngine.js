const DOMAIN_WEIGHTS =
require("./domainWeights");

const SEVERITY_WEIGHTS =
require("./severityWeights");

function calculateGovernancePriority(signal) {

  const domainWeight =
    DOMAIN_WEIGHTS[signal.domain] || 0;

  const severityWeight =
    SEVERITY_WEIGHTS[signal.severity] || 0;

  return domainWeight + severityWeight;
}

module.exports =
calculateGovernancePriority;