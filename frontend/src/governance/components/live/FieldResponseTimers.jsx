// src/governance/components/live/FieldResponseTimers.jsx

import React from "react";

export default function FieldResponseTimers({
  tasks = []
}) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-4">
        Field Response Timers
      </h2>

      <div className="space-y-4">

        {tasks.map((t, i) => (

          <div
            key={i}
            className="border rounded-xl p-4"
          >

            <div className="flex justify-between">

              <span className="font-semibold">
                {t.task}
              </span>

              <span
                className={
                  t.etaStatus === "DELAYED"
                    ? "text-red-600 font-bold"
                    : "text-green-600 font-bold"
                }
              >
                {t.etaStatus}
              </span>

            </div>

            <p className="text-gray-600">
              District: {t.district}
            </p>

            <p>
              Elapsed: {t.elapsedMinutes} min
            </p>

            <p>
              Remaining ETA: {t.remaining} min
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}