// src/components/governance/EscalationChainPanel.jsx

import React from "react";

export default function EscalationChainPanel({
  chains
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Escalation Chains
      </h2>

      <div className="space-y-4">

        {chains.map((item, index) => (

          <div
            key={index}
            className="border-l-4 border-red-500 pl-4"
          >

            <h3 className="font-bold">
              {item.district}
            </h3>

            <p>{item.issue}</p>

            <p className="text-sm text-gray-600">
              Owner: {item.owner}
            </p>

            <span className="text-red-600 font-semibold">
              {item.escalationLevel}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}