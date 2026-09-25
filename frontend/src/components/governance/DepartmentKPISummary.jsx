// src/components/governance/DepartmentKPISummary.jsx

import React from "react";

export default function DepartmentKPISummary() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Department KPI Summary
      </h2>

      <div className="space-y-4">

        <div>
          Emergency Response Efficiency: 82%
        </div>

        <div>
          Citizen Resolution Rate: 74%
        </div>

        <div>
          Escalation Closure Time: 41 mins avg
        </div>

      </div>

    </div>
  );
}