const DEPENDENCY_MAP =
require("./dependencyMap");

function resolveDependencies(signal) {

  const impactedDomains =
    DEPENDENCY_MAP[signal.domain] || [];

  return {

    domain: signal.domain,

    impacted_domains: impactedDomains,

    cascading_risk:
      impactedDomains.length > 0
        ? "HIGH"
        : "LOW"
  };
}

module.exports = resolveDependencies;