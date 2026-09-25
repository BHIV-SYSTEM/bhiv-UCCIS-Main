const { emit } =
  require("./eventBus");

async function runOperationalDemo() {

  const signal = await emit(
    "SIGNAL",
    {
      severity: "high"
    }
  );

  const escalation = await emit(
    "ESCALATION",
    {
      acknowledged: true
    }
  );

  const resolution = await emit(
    "RESOLUTION",
    {
      resolved: true
    }
  );

  return {
    signal,
    escalation,
    resolution,
    replaySafe: true,
    governanceVerified: true
  };
}

module.exports = {
  runOperationalDemo
};