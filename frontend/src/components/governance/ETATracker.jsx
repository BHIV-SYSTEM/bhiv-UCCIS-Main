// src/components/governance/ETATracker.jsx

import React from "react";

export default function ETATracker({
  eta
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        Estimated Arrival
      </h2>

      <div className="text-5xl font-bold text-blue-600">
        {eta}
      </div>

    </div>
  );
}