function evaluateGovernance(risk) {

  if (risk.risk_score > 70) {
    return {
      approval_required: true,
      authority: "Ministerial Command"
    };
  }

  return {
    approval_required: false,
    authority: "Automated Execution"
  };
}

module.exports = evaluateGovernance;