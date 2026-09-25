// src/components/governance/CrisisEscalationFeed.jsx

import React from "react";

export default function CrisisEscalationFeed({
  escalations
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        Crisis Escalation Feed
      </h2>

      <div className="space-y-4">

        {escalations.map((item, index) => (
          <div
            key={index}
            className="border-l-4 border-red-500 pl-4"
          >
            <h3 className="font-bold">
              {item.district}
            </h3>

            <p>{item.summary}</p>

            <span className="text-red-600 font-semibold">
              {item.severity}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}