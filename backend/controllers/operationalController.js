const {
  runOperationalSimulation
} = require(
  "../services/operationalSimulationService"
);

const {
  validateAuditTrail
} = require(
  "../services/auditValidationService"
);

const {
  getUptimeStatus
} = require(
  "../services/uptimeService"
);

function runSimulation(req, res) {

  const simulation =
    runOperationalSimulation();

  const audit =
    validateAuditTrail(
      simulation
    );

  const uptime =
    getUptimeStatus();

  res.json({
    success: true,

    simulation,

    audit,

    uptime
  });
}

module.exports = {
  runSimulation
};