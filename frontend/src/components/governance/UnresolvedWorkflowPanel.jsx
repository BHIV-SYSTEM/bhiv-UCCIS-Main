// src/components/governance/UnresolvedWorkflowPanel.jsx

import React from "react";

export default function UnresolvedWorkflowPanel() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        Unresolved Workflows
      </h2>

      <div className="space-y-4">

        <div className="border rounded-xl p-4">
          Emergency drainage approval pending.
        </div>

        <div className="border rounded-xl p-4">
          Cross-district deployment authorization delayed.
        </div>

      </div>

    </div>
  );
}