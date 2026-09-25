// src/governance/components/live/LiveEscalationTicker.jsx

import React from "react";

export default function LiveEscalationTicker({
  items
}) {

  return (

    <div className="bg-black text-white p-4 rounded-xl">

      <h2 className="text-xl font-bold mb-4">
        Live Escalation Ticker
      </h2>

      <div className="space-y-2">

        {items.map((i, idx) => (

          <div key={idx}>

            [{i.district}] {i.message}
            — {i.ageMinutes} min ago

          </div>

        ))}

      </div>

    </div>

  );

}