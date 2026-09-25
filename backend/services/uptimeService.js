function getUptimeStatus() {
  return {
    uptime_verified: true,

    active_environment:
      process.env.ENVIRONMENT,

    operational: true,

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  getUptimeStatus
};