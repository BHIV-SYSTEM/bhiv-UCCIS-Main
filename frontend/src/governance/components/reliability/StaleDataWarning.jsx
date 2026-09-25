// src/governance/components/reliability/StaleDataWarning.jsx

import React from "react";

export default function StaleDataWarning({
  stale
}) {

  if (!stale.stale) {
    return null;
  }

  return (

    <div className="bg-yellow-100 p-4 rounded-xl">

      <h2 className="font-bold text-yellow-700">
        Stale Data Warning
      </h2>

      <p>
        {stale.warning}
      </p>

    </div>

  );

}