// src/governance/components/replayValidation/ReplayValidationDashboard.jsx

import React from "react";

export default function ReplayValidationDashboard({
  result
}) {

  return (

    <div className="p-6 bg-white rounded-2xl shadow-lg">

      <h1 className="text-3xl font-bold mb-6">
        Distributed Replay Validation
      </h1>

      <div className="space-y-4">

        <div>
          <strong>Immutable Order:</strong>{" "}
          {result.immutableOrderValid
            ? "VALID"
            : "BROKEN"}
        </div>

        <div>
          <strong>Append-only:</strong>{" "}
          {result.appendOnlyValid
            ? "VALID"
            : "BROKEN"}
        </div>

        <div>
          <strong>Deterministic Replay:</strong>{" "}
          {result.deterministicReplay
            ? "VALID"
            : "BROKEN"}
        </div>

        {result.issues.length > 0 && (
          <div className="text-red-600">

            <strong>Issues:</strong>

            <ul>
              {result.issues.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>

          </div>
        )}

      </div>

    </div>

  );
}