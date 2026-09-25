// src/components/governance/DelayedExecutionPanel.jsx

import React from "react";

export default function DelayedExecutionPanel({
  delays
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Delayed Execution Visibility
      </h2>

      <div className="space-y-4">

        {delays.map((item, index) => (

          <div
            key={index}
            className="border rounded-xl p-4"
          >

            <h3 className="font-bold">
              {item.department}
            </h3>

            <p>
              Delay: {item.delay}
            </p>

            <p>
              Cause: {item.reason}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}