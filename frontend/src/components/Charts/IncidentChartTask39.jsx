import React from "react";

const IncidentChartTask39 = ({ incidents = [] }) => {
  return (
    <div className="chart-card">
      <h3>Incident Summary</h3>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "15px"
        }}
      >
        <div className="metric-card">
          <h4>Total Incidents</h4>
          <h2>{incidents.length}</h2>
        </div>

        <div className="metric-card">
          <h4>Open</h4>
          <h2>
            {
              incidents.filter(
                x => x.status === "Open"
              ).length
            }
          </h2>
        </div>

        <div className="metric-card">
          <h4>Resolved</h4>
          <h2>
            {
              incidents.filter(
                x => x.status === "Resolved"
              ).length
            }
          </h2>
        </div>
      </div>
    </div>
  );
};

export default IncidentChartTask39;