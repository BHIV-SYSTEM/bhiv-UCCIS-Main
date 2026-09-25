const processLifecycle =
require("./lifecycleEngine");

function lifecycleOrchestrator(actions) {

  const results = [];

  actions.forEach((action) => {

    const result =
      processLifecycle(action);

    results.push(result);

  });

  return results;
}

module.exports =
lifecycleOrchestrator;