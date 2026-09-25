import React from "react";

function ZoneHeatmap() {

  const zones = [
    {
      name: "South Mumbai",
      level: "HIGH"
    },
    {
      name: "Bandra",
      level: "LOW"
    },
    {
      name: "Thane West",
      level: "MODERATE"
    },
    {
      name: "Navi Mumbai",
      level: "LOW"
    }
  ];

  return (

    <div className="zone-heatmap">

      <h2>Zone Heatmap</h2>

      <div className="heatmap-grid">

        {
          zones.map((zone, index) => (

            <div
              key={index}
              className={`zone-card ${zone.level.toLowerCase()}`}
            >

              <h3>{zone.name}</h3>

              <p>{zone.level}</p>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default ZoneHeatmap;