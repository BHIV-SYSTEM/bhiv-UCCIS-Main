import { useEffect, useState } from "react";
import axios from "axios";

import "../App.css";

function FieldExecution() {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchExecutionData();
  }, []);

  const fetchExecutionData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/execution"
      );

      setData(response.data);

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch field execution data");

      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        Loading field execution intelligence...
      </div>
    );
  }

  if (error) {
    return <div className="page-center">{error}</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050816",
        color: "white",
        padding: "30px",
      }}
    >
      <h1
        style={{
          fontSize: "40px",
          marginBottom: "10px",
        }}
      >
        Field Execution Command Center
      </h1>

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "30px",
        }}
      >
        Live operational execution monitoring
      </p>

      {/* Cards */}

      <div className="grid-cards">
        <div className="card">
          <h3>Field Units Active</h3>

          <h2>
            {data?.data?.field_units_active}
          </h2>
        </div>

        <div className="card">
          <h3>Emergency Vehicles</h3>

          <h2>
            {data?.data?.emergency_vehicles}
          </h2>
        </div>

        <div className="card">
          <h3>Response Teams</h3>

          <h2>
            {data?.data?.response_teams}
          </h2>
        </div>

        <div className="card">
          <h3>Operational Status</h3>

          <h2>
            {data?.data?.operational_status}
          </h2>
        </div>
      </div>

      {/* Feed */}

      <div
        className="feed"
        style={{
          marginTop: "40px",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            color: "cyan",
          }}
        >
          Execution Feed
        </h2>

        {data?.data?.execution_feed?.map((item, index) => (
          <div
            key={index}
            className="feed-item"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Backend Response */}

      <div
        className="chart-box"
        style={{
          marginTop: "40px",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Backend Response
        </h2>

        <pre
          style={{
            color: "#00ff88",
            overflowX: "auto",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default FieldExecution;