import React from "react";

function ExecutiveSummary({ intelligence }) {

  return (

    <div className="bg-white p-4 rounded shadow">

      <h2>Executive Summary</h2>

      <p>
        Active Zones:
        {intelligence.length}
      </p>

      <p>
        Critical Escalations:
        {
          intelligence.filter(
            i => i.escalation === "CRITICAL"
          ).length
        }
      </p>

    </div>
  );
}

export default ExecutiveSummary;