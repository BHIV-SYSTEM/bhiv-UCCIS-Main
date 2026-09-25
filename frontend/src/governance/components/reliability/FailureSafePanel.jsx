// src/governance/components/reliability/FailureSafePanel.jsx

import React from "react";

export default function FailureSafePanel({
  failure
}) {

  if (!failure) {
    return null;
  }

  return (

    <div className="bg-red-100 p-6 rounded-2xl">

      <h2 className="text-2xl font-bold text-red-700">
        Operational Recovery Mode
      </h2>

      <p className="mt-2 text-red-600">
        Some operational data unavailable.
      </p>

      <p className="mt-2">
        Retry and continuity safeguards active.
      </p>

    </div>

  );

}