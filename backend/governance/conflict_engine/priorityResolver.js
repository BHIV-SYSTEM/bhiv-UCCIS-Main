const calculateGovernancePriority =
require("./overrideEngine");

function resolvePriority(signals) {

  const scoredSignals =
    signals.map((signal) => {

      return {
        ...signal,

        governance_priority:
          calculateGovernancePriority(signal)
      };

    });

  scoredSignals.sort((a, b) => {

    return (
      b.governance_priority -
      a.governance_priority
    );

  });

  return scoredSignals;
}

module.exports = resolvePriority;