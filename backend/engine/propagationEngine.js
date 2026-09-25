const adjacencyEngine =
  require("./adjacencyEngine");

class PropagationEngine {

  propagate(zoneId, finalScore) {

    const neighbors =
      adjacencyEngine.getNeighbors(zoneId);

    const propagation = [];

    neighbors.forEach(neighbor => {

      let propagatedRisk = 0;

      // HIGH RISK SPREAD
      if (finalScore >= 80) {

        propagatedRisk = 20;

      }

      // MEDIUM RISK SPREAD
      else if (finalScore >= 50) {

        propagatedRisk = 10;

      }

      // LOW RISK SPREAD
      else {

        propagatedRisk = 5;

      }

      propagation.push({

        influenced_zone:
          neighbor,

        propagated_risk:
          propagatedRisk,

        propagation_reason:
          `Zone ${zoneId} influenced neighboring zone ${neighbor}`
      });
    });

    return propagation;
  }
}

module.exports =
  new PropagationEngine();