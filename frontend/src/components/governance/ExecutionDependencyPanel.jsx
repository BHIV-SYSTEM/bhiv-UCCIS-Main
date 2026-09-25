// src/components/governance/ExecutionDependencyPanel.jsx

import React from "react";

export default function ExecutionDependencyPanel({
  dependencies
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Execution Dependencies
      </h2>

      <div className="space-y-4">

        {dependencies.map((item, index) => (

          <div
            key={index}
            className="border-l-4 border-yellow-500 pl-4"
          >

            <h3 className="font-bold">
              {item.dependency}
            </h3>

            <p>{item.impact}</p>

          </div>
        ))}

      </div>

    </div>
  );
}