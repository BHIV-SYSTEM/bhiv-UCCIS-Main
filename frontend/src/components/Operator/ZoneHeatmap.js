import React from "react";

function ZoneHeatmap({ intelligence }) {

  return (

    <div className="bg-gray-100 p-4 rounded shadow">

      <h2>Zone Heatmap</h2>

      {
        intelligence.map((zone, index) => (

          <div
            key={index}
            style={{
              margin: "10px",
              padding: "10px",
              background:
                zone.escalation === "CRITICAL"
                  ? "#ff4d4f"
                  : zone.escalation === "HIGH"
                  ? "#fa8c16"
                  : "#52c41a",
              color: "white"
            }}
          >

            {zone.zone}

          </div>
        ))
      }

    </div>
  );
}

export default ZoneHeatmap;