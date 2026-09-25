exports.generateExecutionRequest = (risk) => {
  if (risk >= 80) return { action: "ALERT", priority: "HIGH" };
  if (risk >= 50) return { action: "MONITOR", priority: "MEDIUM" };
  return { action: "NONE", priority: "LOW" };
};