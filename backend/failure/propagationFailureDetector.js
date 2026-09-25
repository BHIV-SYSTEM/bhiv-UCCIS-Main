// failure/propagationFailureDetector.js

class PropagationFailureDetector {

  check(cluster) {

    if (
      !cluster ||
      !cluster.propagated_zones
    ) {

      return {

        failed: true,

        type:
          "CLUSTER_PROPAGATION_FAILURE",

        reason:
          "Propagation engine failed",

        recovery:
          "Rebuild adjacency model"
      };
    }

    return {

      failed: false
    };
  }
}

module.exports =
  new PropagationFailureDetector();