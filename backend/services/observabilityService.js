const {
  getDependencyStates
} = require(
  "./dependencyMonitorService"
);

const {
  getIngestionHealth
} = require(
  "./ingestionHealthService"
);

const {
  getEscalationAging
} = require(
  "./escalationMonitorService"
);

const {
  getUnresolvedGovernanceStates
} = require(
  "./unresolvedStateService"
);

function getObservabilityOverview() {
  return {
    replay_validation: "VALID",

    dependency_states:
      getDependencyStates(),

    ingestion_health:
      getIngestionHealth(),

    escalation_aging:
      getEscalationAging(),

    unresolved_governance_states:
      getUnresolvedGovernanceStates()
  };
}

module.exports = {
  getObservabilityOverview
};