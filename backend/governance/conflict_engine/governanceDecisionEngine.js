const resolvePriority =
require("./priorityResolver");

const resolveDependencies =
require("./dependencyResolver");

function governanceDecisionEngine(signals) {

  const prioritizedSignals =
    resolvePriority(signals);

  const primaryDecision =
    prioritizedSignals[0];

  const dependencyAnalysis =
    resolveDependencies(primaryDecision);

  return {

    governance_mode:
      primaryDecision.severity === "CRITICAL"
        ? "EMERGENCY_OVERRIDE"
        : "STANDARD_GOVERNANCE",

    primary_domain:
      primaryDecision.domain,

    priority_score:
      primaryDecision.governance_priority,

    severity:
      primaryDecision.severity,

    dependency_analysis:
      dependencyAnalysis,

    ordered_resolution:
      prioritizedSignals
  };
}

module.exports =
governanceDecisionEngine;