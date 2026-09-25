function tantraReplayIntegrator(
  stages
) {

  return {

    replay_enabled: true,

    replay_chain:
      stages.map(stage => {

        return {

          stage:
            stage.stage,

          timestamp:
            stage.timestamp
        };

      })
  };
}

module.exports =
tantraReplayIntegrator;