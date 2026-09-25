// src/components/governance/ExecutionBottleneckPanel.jsx

import React from "react";

export default function ExecutionBottleneckPanel() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        Execution Bottlenecks
      </h2>

      <div className="space-y-4">

        <div className="border-l-4 border-orange-500 pl-4">
          Field response delays increasing
          in eastern sectors.
        </div>

        <div className="border-l-4 border-red-500 pl-4">
          Drainage vehicle availability constrained
          during peak rainfall window.
        </div>

      </div>

    </div>
  );
}