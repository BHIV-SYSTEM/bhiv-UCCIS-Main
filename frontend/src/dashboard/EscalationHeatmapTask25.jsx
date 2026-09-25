import React from "react";

function EscalationHeatmapTask25({ escalations }) {
  return (
    <div className="uccis-card">
      <h3>🔥 Escalation Heatmap</h3>

      <div className="heatmap-grid">
        {escalations.map((item) => (
          <div
            key={item.id}
            className={`heatbox ${item.escalation_level}`}
          >
            <h4>{item.escalation_level}</h4>
            <p>{item.escalated_to}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EscalationHeatmapTask25;