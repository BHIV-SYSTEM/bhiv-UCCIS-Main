// src/governance/components/reliability/DashboardHealthBanner.jsx

import React from "react";

export default function DashboardHealthBanner({
  health
}) {

  return (

    <div className="bg-black text-white p-6 rounded-2xl">

      <h2 className="text-2xl font-bold">
        Dashboard Health
      </h2>

      <p className="mt-2">
        State:
        {health.state}
      </p>

      <p>
        Stability Score:
        {health.score}
      </p>

    </div>

  );

}