// src/technical/components/ReplayContractViewer.jsx

import React from "react";

export default function ReplayContractViewer({
  contracts
}) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-4">
        Replay Contracts
      </h2>

      {contracts.map((c, i) => (

        <div
          key={i}
          className="border p-4 rounded-xl mb-4"
        >

          <p>
            Contract:
            {c.contractId}
          </p>

          <p>
            Version:
            {c.replayVersion}
          </p>

          <p>
            Immutable:
            {String(c.appendOnly)}
          </p>

        </div>

      ))}

    </div>

  );

}