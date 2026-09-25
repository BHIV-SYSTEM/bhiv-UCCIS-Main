// src/components/governance/DependencyFailurePanel.jsx

import React from "react";

export default function DependencyFailurePanel() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        Dependency Failures
      </h2>

      <div className="space-y-4">

        <div className="border-l-4 border-red-500 pl-4">
          Drainage coordination delayed
          due to equipment shortage.
        </div>

        <div className="border-l-4 border-yellow-500 pl-4">
          Emergency routing impacted
          by traffic congestion.
        </div>

      </div>

    </div>
  );
}