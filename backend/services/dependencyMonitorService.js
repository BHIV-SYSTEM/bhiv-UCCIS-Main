function getDependencyStates() {
  return [
    {
      service: "Replay Engine",
      status: "HEALTHY"
    },
    {
      service: "Lifecycle Persistence",
      status: "HEALTHY"
    },
    {
      service: "Concurrency Validation",
      status: "HEALTHY"
    },
    {
      service: "Enforcement Boundary",
      status: "HEALTHY"
    }
  ];
}

module.exports = {
  getDependencyStates
};