// src/components/governance/StatewidePriorityPanel.jsx

import React from "react";

export default function StatewidePriorityPanel({
  priorities
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        Statewide Operational Priorities
      </h2>

      <div className="space-y-3">

        {priorities.map((item, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 bg-gray-50"
          >
            {item}
          </div>
        ))}

      </div>

    </div>
  );
}