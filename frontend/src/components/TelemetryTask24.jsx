import React, { useEffect, useState } from "react";
import axios from "axios";

function TelemetryTask24() {
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/telemetry"
      );

      setTelemetry(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Telemetry Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  return (
    <div className="page-container">
      <h1>Telemetry Monitoring</h1>

      <div className="stats-row">
        <div className="stat-card">
          <h3>Total Records</h3>
          <p>{telemetry.length}</p>
        </div>

        <div className="stat-card">
          <h3>Status</h3>
          <p>Active</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Signal ID</th>
              <th>Metric</th>
              <th>Value</th>
              <th>Captured At</th>
            </tr>
          </thead>

          <tbody>
            {telemetry.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.signal_id}</td>
                <td>{item.metric_name}</td>
                <td>{item.metric_value}</td>
                <td>{item.captured_at}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {telemetry.length === 0 && !loading && (
          <p>No telemetry data found.</p>
        )}
      </div>
    </div>
  );
}

export default TelemetryTask24;