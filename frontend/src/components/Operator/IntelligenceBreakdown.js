import React from "react";

function IntelligenceBreakdown({ intelligence }) {

  return (

    <div className="bg-white p-4 rounded shadow">

      <h2>Intelligence Explanations</h2>

      {
        intelligence.map((zone, index) => (

          <div key={index}>

            <h3>{zone.zone}</h3>

            <p>
              Score:
              {zone.score}
            </p>

            <p>
              Trend:
              {zone.trend}
            </p>

            <p>
              Confidence:
              {zone.confidence}
            </p>

          </div>
        ))
      }

    </div>
  );
}

export default IntelligenceBreakdown;