// src/governance/components/replay/ReplayStoryView.jsx

import React from "react";

export default function ReplayStoryView({ story }) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Replay Story Mode
      </h2>

      <div className="space-y-4">

        {story.map((line, index) => (

          <div
            key={index}
            className="border-l-4 border-blue-500 pl-4"
          >

            <p className="text-gray-800 text-lg">
              {line}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}