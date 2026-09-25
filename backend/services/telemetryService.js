const generateTelemetry = () => {

  return {
    districts: [
      {
        name: "Nashik",
        health: "stable",
        confidence: "91%"
      },
      {
        name: "Pune",
        health: "warning",
        confidence: "74%"
      },
      {
        name: "Mumbai",
        health: "critical",
        confidence: "52%"
      }
    ],
    timestamp: new Date()
  };
};

module.exports = {
  generateTelemetry
};