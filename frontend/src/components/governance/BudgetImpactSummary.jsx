// src/components/governance/BudgetImpactSummary.jsx

import React from "react";

export default function BudgetImpactSummary() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        Budget Impact Summary
      </h2>

      <div className="space-y-3">

        <div>
          Emergency Allocation Usage: 68%
        </div>

        <div>
          Drainage Operations Cost Pressure: Moderate
        </div>

        <div>
          Additional Deployment Requirement:
          ₹12 Cr Estimated
        </div>

      </div>

    </div>
  );
}