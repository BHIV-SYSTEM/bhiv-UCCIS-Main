// src/components/governance/ProofUploadPanel.jsx

import React from "react";

export default function ProofUploadPanel() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Proof Upload
      </h2>

      <input
        type="file"
        className="border p-3 rounded-xl w-full"
      />

      <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl">
        Upload Operational Proof
      </button>

    </div>
  );
}