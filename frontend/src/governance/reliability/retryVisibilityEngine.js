// src/governance/reliability/retryVisibilityEngine.js

export function retryVisibilityEngine(
  retries = 0
) {

  return {

    retries,

    visible:
      retries > 0,

    status:

      retries > 3
        ? "CRITICAL"
        : retries > 0
        ? "RETRYING"
        : "STABLE"

  };

}