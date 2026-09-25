// src/governance/components/live/ExecutionCounterStrip.jsx

import React from "react";

export default function ExecutionCounterStrip({
  stats
}) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-4">
        Execution Counters
      </h2>

      <div className="grid grid-cols-3 gap-4 text-center">

        <div className="p-4 border rounded-xl">

          <p className="text-xl font-bold">
            {stats.active}
          </p>

          <p>Active</p>

        </div>

        <div className="p-4 border rounded-xl">

          <p className="text-xl font-bold text-green-600">
            {stats.completed}
          </p>

          <p>Completed</p>

        </div>

        <div className="p-4 border rounded-xl">

          <p className="text-xl font-bold text-orange-600">
            {stats.pending}
          </p>

          <p>Pending</p>

        </div>

      </div>

      <div className="mt-4 text-center">

        <span className="font-bold text-blue-600">
          Efficiency: {stats.efficiency}%
        </span>

      </div>

    </div>

  );

}