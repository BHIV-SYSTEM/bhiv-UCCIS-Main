// src/governance/reliability/staleDataEngine.js

export function staleDataEngine(
  lastUpdatedMinutes = 0
) {

  return {

    stale:
      lastUpdatedMinutes > 5,

    age:
      lastUpdatedMinutes,

    warning:

      lastUpdatedMinutes > 5
        ? "Operational data may be outdated"
        : "Operational data current"

  };

}