// src/components/governance/DistrictOperationalHealth.jsx

import React from "react";

export default function DistrictOperationalHealth({
  districts
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        District Operational Health
      </h2>

      <div className="space-y-4">

        {districts.map((item, index) => (

          <div key={index}>

            <div className="flex justify-between mb-2">

              <span className="font-semibold">
                {item.district}
              </span>

              <span>
                {item.health}%
              </span>

            </div>

            <div className="w-full bg-gray-200 h-4 rounded-full">

              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{
                  width: `${item.health}%`
                }}
              />

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}