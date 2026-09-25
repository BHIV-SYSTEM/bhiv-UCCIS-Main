// src/technical/components/ObservabilityPanel.jsx

import React from "react";

export default function ObservabilityPanel({
  metrics
}) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-4">
        Observability Internals
      </h2>

      <div className="space-y-2">

        <p>
          Active Streams:
          {metrics.activeReplayStreams}
        </p>

        <p>
          Stale Streams:
          {metrics.staleStreams}
        </p>

        <p>
          Recovery Latency:
          {metrics.replayRecoveryLatency}
        </p>

        <p>
          Consistency:
          {metrics.distributedConsistency}
        </p>

      </div>

    </div>

  );

}