function tantraUIEvolutionEngine(
  stages
) {

  return {

    ui_status:

      stages.some(
        s =>
          s.stage === "RESOLUTION"
      )

      ? "RESOLUTION_VISIBLE"

      : "ACTIVE_MONITORING",

    visible_stages:

      stages.map(s => s.stage)
  };
}

module.exports =
tantraUIEvolutionEngine;