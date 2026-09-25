// src/components/governance/AgingIncidentPanel.jsx

import React from "react";

export default function AgingIncidentPanel({
  incidents
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Aging Incidents
      </h2>

      <div className="space-y-4">

        {incidents.map((item, index) => (

          <div
            key={index}
            className="border-l-4 border-orange-500 pl-4"
          >

            <h3 className="font-bold">
              {item.district}
            </h3>

            <p>
              Incident unresolved for {item.age}
            </p>

            <span className="text-orange-600 font-semibold">
              {item.severity}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}