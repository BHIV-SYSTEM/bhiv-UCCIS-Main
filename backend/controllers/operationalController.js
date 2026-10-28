
const {
  runOperationalSimulation,
} = require("../services/operationalSimulationService");

const {
  validateAuditTrail,
} = require("../services/auditValidationService");

const {
  getUptimeStatus,
} = require("../services/uptimeService");

function runSimulation(req, res) {
  try {
    const simulation = runOperationalSimulation();
    const audit = validateAuditTrail(simulation);
    const uptime = getUptimeStatus();

    return res.json({
      success: true,
      simulation,
      audit,
      uptime,
    });
  } catch (error) {
    console.error("Operational simulation failed:", error);

    return res.status(500).json({
      success: false,
      message: "Operational simulation failed",
    });
  }
}

module.exports = {
  runSimulation,
};
