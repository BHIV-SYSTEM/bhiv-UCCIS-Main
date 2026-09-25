// src/components/governance/EscalationRoutingPanel.jsx

import React from "react";

export default function EscalationRoutingPanel({
  routes
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Escalation Routing
      </h2>

      <div className="space-y-4">

        {routes.map((item, index) => (

          <div
            key={index}
            className="border rounded-xl p-4"
          >

            <h3 className="font-bold">
              {item.district}
            </h3>

            <p>
              Routed To:
              {item.routedTo}
            </p>

            <p>
              Status:
              {item.status}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}