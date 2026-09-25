// src/governance/reliability/loadingStateEngine.js

export function loadingStateEngine(
  loading = false
) {

  return {

    loading,

    message:
      loading
        ? "Operational data loading..."
        : "Operational data synchronized"

  };

}