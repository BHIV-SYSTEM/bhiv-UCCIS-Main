function validateReplayIntegrity(
  replay
) {

  const requiredStages = [

    "signal",
    "intelligence",
    "governance",
    "execution",
    "resolution"
  ];

  const missingStages =
    requiredStages.filter(
      stage => !replay[stage]
    );

  return {

    valid:
      missingStages.length === 0,

    missing_stages:
      missingStages
  };
}

module.exports =
validateReplayIntegrity;