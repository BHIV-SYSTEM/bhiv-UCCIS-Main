// src/governance/reliability/dashboardHealthEngine.js

export function dashboardHealthEngine(
  metrics
) {

  const score =
    (
      metrics.routing +
      metrics.reliability +
      metrics.loading +
      metrics.refresh
    ) / 4;

  return {

    score,

    state:

      score > 80
        ? "HEALTHY"
        : score > 50
        ? "DEGRADED"
        : "UNSTABLE"

  };

}