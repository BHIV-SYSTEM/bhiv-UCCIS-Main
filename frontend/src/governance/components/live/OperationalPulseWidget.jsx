// src/governance/components/live/OperationalPulseWidget.jsx

import React from "react";

export default function OperationalPulseWidget({
  pulse
}) {

  return (

    <div className="bg-black text-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-4">
        Operational Pulse
      </h2>

      <div className="text-4xl font-bold">

        {pulse.pulse}

      </div>

      <p className="mt-2 text-gray-300">
        Score: {pulse.score}
      </p>

      <p className="mt-2 text-gray-300">
        {pulse.message}
      </p>

    </div>

  );

}