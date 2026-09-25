import React from "react";

function GISPage() {

  const zones = [
    {
      area: "Ward 1",
      incidents: 5,
      level: "low"
    },
    {
      area: "Ward 2",
      incidents: 12,
      level: "medium"
    },
    {
      area: "Ward 3",
      incidents: 21,
      level: "high"
    },
    {
      area: "Ward 4",
      incidents: 30,
      level: "critical"
    },
    {
      area: "Ward 5",
      incidents: 8,
      level: "medium"
    },
    {
      area: "Ward 6",
      incidents: 25,
      level: "high"
    }
  ];

  return (
    <div>

      {/* KPI CARDS */}

      <div className="card-grid">

        <div className="metric-card">
          <h2>24</h2>
          <p>Mapped Zones</p>
        </div>

        <div className="metric-card">
          <h2>101</h2>
          <p>GIS Signals</p>
        </div>

        <div className="metric-card">
          <h2>12</h2>
          <p>Hotspots</p>
        </div>

        <div className="metric-card">
          <h2>98%</h2>
          <p>Coverage</p>
        </div>

      </div>

      {/* HEATMAP */}

      <div className="chart-card">

        <h2>🗺 GIS Heatmap</h2>

        <div className="heatmap-grid">

          {zones.map((zone,index)=>(
            <div
              key={index}
              className={`heatmap-card ${zone.level}`}
            >
              <h3>{zone.area}</h3>
              <h2>{zone.incidents}</h2>
              <p>Incidents</p>
            </div>
          ))}

        </div>

      </div>

      {/* GIS BACKEND */}

      <div className="chart-card">

        <h2>🗄 GIS Backend Response</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>Zone</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>Ward 1</td>
              <td style={{ color: "#000000"}}>18.5204</td>
              <td style={{ color: "#000000"}}>73.8567</td>
              <td style={{ color: "#000000"}}>Mapped</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Ward 2</td>
              <td style={{ color: "#000000"}}>18.5400</td>
              <td style={{ color: "#000000"}}>73.8500</td>
              <td style={{ color: "#000000"}}>Mapped</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Ward 3</td>
              <td style={{ color: "#000000"}}>18.5600</td>
              <td style={{ color: "#000000"}}>73.8700</td>
              <td style={{ color: "#000000"}}>Hotspot</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* HOTSPOTS */}

      <div className="chart-card">

        <h2>🔥 Active Hotspots</h2>

        <table className="runtime-table" style={{ color: "#000000"}}>

          <thead>
            <tr>
              <th>Location</th>
              <th>Type</th>
              <th>Risk</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={{ color: "#000000"}}>Ward 4</td>
              <td style={{ color: "#000000"}}>Waste Overflow</td>
              <td style={{ color: "#000000"}}>Critical</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Ward 3</td>
              <td style={{ color: "#000000"}}>Water Leakage</td>
              <td style={{ color: "#000000"}}>High</td>
            </tr>

            <tr>
              <td style={{ color: "#000000"}}>Ward 6</td>
              <td style={{ color: "#000000"}}>Traffic Congestion</td>
              <td style={{ color: "#000000"}}>High</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* TIMELINE */}

      <div className="chart-card">

        <h2>🕒 GIS Timeline</h2>

        <div className="timeline">

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              09:00 - GIS Data Loaded
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              09:15 - Heatmap Generated
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              09:30 - Hotspot Detection Complete
            </div>
          </div>

        </div>

      </div>

      {/* GIS ENGINE STATUS */}

      {/* <div className="chart-card">

        <h2>⚙ GIS Engine Status</h2>

        <div className="card-grid">

          <div className="metric-card">
            <h2>ONLINE</h2>
            <p>GIS Engine</p>
          </div>

          <div className="metric-card">
            <h2>CONNECTED</h2>
            <p>Database</p>
          </div>

          <div className="metric-card">
            <h2>ACTIVE</h2>
            <p>Heatmap Service</p>
          </div>

          <div className="metric-card">
            <h2>99%</h2>
            <p>Map Accuracy</p>
          </div>

        </div>

      </div> */}

    </div>
  );
}

export default GISPage;