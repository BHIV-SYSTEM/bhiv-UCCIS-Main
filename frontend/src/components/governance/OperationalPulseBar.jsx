// src/components/governance/OperationalPulseBar.jsx

import React from "react";

export default function OperationalPulseBar({
  pulse
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Operational Pulse
      </h2>

      <div className="space-y-6">

        <div>
          <p>Statewide Stability</p>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{
                width: `${pulse.statewideStability}%`
              }}
            />
          </div>
        </div>

        <div>
          <p>Emergency Readiness</p>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-600 h-4 rounded-full"
              style={{
                width: `${pulse.emergencyReadiness}%`
              }}
            />
          </div>
        </div>

      </div>

    </div>
  );
}