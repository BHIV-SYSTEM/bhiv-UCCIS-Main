// src/components/governance/OperationalDelayPanel.jsx

import React from "react";

export default function OperationalDelayPanel({
  delays
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Operational Delays
      </h2>

      <div className="space-y-4">

        {delays.map((item, index) => (

          <div
            key={index}
            className="border-l-4 border-red-500 pl-4"
          >

            <h3 className="font-bold">
              {item.operation}
            </h3>

            <p>
              Delay:
              {item.delay}
            </p>

            <p>
              Reason:
              {item.reason}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}