// src/components/governance/GeoLocationPanel.jsx

import React from "react";

export default function GeoLocationPanel({
  location
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        Geo Location
      </h2>

      <p className="text-lg">
        {location}
      </p>

    </div>
  );
}