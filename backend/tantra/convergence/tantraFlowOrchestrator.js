const tantraSignalProcessor =
require("./tantraSignalProcessor");

const tantraIntelligenceProcessor =
require("./tantraIntelligenceProcessor");

const tantraGovernanceProcessor =
require("./tantraGovernanceProcessor");

const tantraEnforcementProcessor =
require("./tantraEnforcementProcessor");

const tantraResolutionProcessor =
require("./tantraResolutionProcessor");

const tantraBucketSnapshot =
require("./tantraBucketSnapshot");

const tantraReplayIntegrator =
require("./tantraReplayIntegrator");

const tantraUIEvolutionEngine =
require("./tantraUIEvolutionEngine");

function tantraFlowOrchestrator(
  payload
) {

  /*
    SIGNAL
  */

  const signal =
    tantraSignalProcessor(payload);

  /*
    INTELLIGENCE
  */

  const intelligence =
    tantraIntelligenceProcessor(
      payload
    );

  /*
    GOVERNANCE
  */

  const governance =
    tantraGovernanceProcessor(
      intelligence
    );

  /*
    ENFORCEMENT
  */

  const enforcement =
    tantraEnforcementProcessor(
      governance
    );

  /*
    RESOLUTION
  */

  const resolution =
    tantraResolutionProcessor(
      enforcement
    );

  const stages = [

    signal,
    intelligence,
    governance,
    enforcement,
    resolution
  ];

  /*
    SNAPSHOT
  */

  const snapshot =
    tantraBucketSnapshot(
      payload.trace_id,
      stages
    );

  /*
    REPLAY
  */

  const replay =
    tantraReplayIntegrator(
      stages
    );

  /*
    UI EVOLUTION
  */

  const uiEvolution =
    tantraUIEvolutionEngine(
      stages
    );

  return {

    trace_id:
      payload.trace_id,

    tantra_flow:
      stages,

    replay,

    snapshot,

    ui_evolution:
      uiEvolution
  };
}

module.exports =
tantraFlowOrchestrator;