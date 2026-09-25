// src/governance/components/reliability/EscalationContinuityCard.jsx

import React from "react";

export default function EscalationContinuityCard({
  items
}) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-4">
        Escalation Continuity
      </h2>

      <div className="space-y-3">

        {items.map((item, index) => (

          <div
            key={index}
            className="border rounded-xl p-4"
          >

            <p>
              Escalation:
              {item.id}
            </p>

            <p>
              State:
              {item.state}
            </p>

            <p>
              Continuity:
              {item.continuity
                ? "VALID"
                : "BROKEN"}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}