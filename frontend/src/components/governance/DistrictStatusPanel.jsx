// src/components/governance/DistrictStatusPanel.jsx

import React from "react";

export default function DistrictStatusPanel() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">

      <h2 className="text-2xl font-bold mb-4">
        District Operational Status
      </h2>

      <div className="space-y-4">

        <div>
          <h3 className="font-semibold">
            Operational Stability
          </h3>

          <p>
            Operationally stable with
            moderate traffic congestion.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Resource Pressure
          </h3>

          <p>
            Drainage teams operating
            at 82% utilization.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Governance Risks
          </h3>

          <p>
            Flood escalation risk increasing
            in eastern sectors.
          </p>
        </div>

      </div>

    </div>
  );
}