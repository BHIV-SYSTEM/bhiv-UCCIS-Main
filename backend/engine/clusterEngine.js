class ClusterEngine {

  calculateClusterScore(
    currentScore,
    propagatedZones
  ) {

    let total =
      currentScore;

    propagatedZones.forEach(zone => {

      total +=
        zone.propagated_risk;

    });

    const average =
      total /
      (propagatedZones.length + 1);

    return Math.round(average);
  }

  classifyCluster(score) {

    if (score >= 80) {

      return "CRITICAL_CLUSTER";

    }

    if (score >= 50) {

      return "ELEVATED_CLUSTER";

    }

    return "STABLE_CLUSTER";
  }
}

module.exports =
  new ClusterEngine();