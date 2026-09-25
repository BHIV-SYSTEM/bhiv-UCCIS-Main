// src/governance/components/live/DistrictHeatMap.jsx

import React from "react";

export default function DistrictHeatMap({
  data
}) {

  return (

    <div className="bg-white p-6 rounded-xl">

      <h2 className="text-2xl font-bold mb-4">
        District Stress Heat
      </h2>

      {data.map((d, i) => (

        <div key={i} className="mb-3">

          <div className="flex justify-between">

            <span>{d.district}</span>

            <span>{d.stressLevel}</span>

          </div>

          <div>{d.label}</div>

        </div>

      ))}

    </div>

  );

}