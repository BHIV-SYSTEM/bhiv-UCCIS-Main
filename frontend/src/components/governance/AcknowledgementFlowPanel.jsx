// src/components/governance/AcknowledgementFlowPanel.jsx

import React from "react";

export default function AcknowledgementFlowPanel({
  acknowledgement
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        Acknowledgement Flow
      </h2>

      <p>
        Current Status:
        <span className="font-bold text-orange-600 ml-2">
          {acknowledgement}
        </span>
      </p>

      <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl">
        Acknowledge Task
      </button>

    </div>
  );
}