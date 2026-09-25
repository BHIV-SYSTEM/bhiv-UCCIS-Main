import React from "react";

function EscalationPanel({ intelligence }) {

  return (

    <div className="bg-red-100 p-4 rounded shadow">

      <h2>Escalation Visibility</h2>

      {
        intelligence.map((zone, index) => (

          <div key={index}>

            <strong>{zone.zone}</strong>

            <p>
              {zone.escalation}
            </p>

          </div>
        ))
      }

    </div>
  );
}

export default EscalationPanel;