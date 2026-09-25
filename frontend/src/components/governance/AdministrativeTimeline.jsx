// src/components/governance/AdministrativeTimeline.jsx

import React from "react";

export default function AdministrativeTimeline({
  timeline
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">

      <h2 className="text-xl font-bold mb-6">
        Operational Timeline
      </h2>

      <div className="space-y-6">

        {timeline.map((item, index) => (
          <div key={index} className="border-l-4 pl-4">

            <p className="font-semibold">
              {item.time}
            </p>

            <p className="text-gray-700">
              {item.narrative}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}