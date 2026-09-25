// src/components/governance/DistrictStressIndicator.jsx

import React from "react";

export default function DistrictStressIndicator({
  district,
  stress
}) {

  const color =
    stress > 80
      ? "bg-red-500"
      : stress > 60
      ? "bg-orange-500"
      : "bg-green-500";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex justify-between">

        <h2 className="text-xl font-bold">
          {district}
        </h2>

        <span className={`${color} text-white px-4 py-2 rounded-full`}>
          {stress}%
        </span>

      </div>

      <p className="mt-4 text-gray-600">
        Operational stress indicator based on
        field escalation activity and response pressure.
      </p>

    </div>
  );
}