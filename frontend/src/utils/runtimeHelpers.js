export const getRuntimeHealth =
  (
    successful,
    total
  ) => {
    if (total === 0) {
      return 0;
    }

    return (
      (
        successful /
        total
      ) *
      100
    ).toFixed(2);
  };

export const formatStatus =
  (status) => {
    switch (status) {
      case "SUCCESS":
        return "✅ Success";

      case "FAILED":
        return "❌ Failed";

      case "RUNNING":
        return "🟡 Running";

      default:
        return "⚪ Unknown";
    }
  };

export const buildTraceChain =
  (traceId) => {
    return [
      {
        layer: "Signal",
        traceId
      },
      {
        layer: "Telemetry",
        traceId
      },
      {
        layer: "Incident",
        traceId
      },
      {
        layer: "Escalation",
        traceId
      },
      {
        layer: "Replay",
        traceId
      },
      {
        layer: "Evidence",
        traceId
      }
    ];
  };