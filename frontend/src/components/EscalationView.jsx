import { useEffect, useState } from "react";
import axios from "axios";

import "../App.css";

function EscalationView() {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchEscalationData();
  }, []);

  const fetchEscalationData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/escalation"
      );

      setData(response.data);

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch escalation intelligence");

      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        Loading escalation intelligence...
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
        Escalation Intelligence Center
      </h1>

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "30px",
        }}
      >
        Live governance escalation monitoring
      </p>

      {/* Main Status */}

      <div className="grid-cards">
        <div className="card">
          <h3>Simulation Completed</h3>

          <h2>
            {data?.data?.simulation_completed ? "YES" : "NO"}
          </h2>
        </div>

        <div className="card">
          <h3>Timestamp</h3>

          <h2 style={{ fontSize: "18px" }}>
            {data?.timestamp}
          </h2>
        </div>

        <div className="card">
          <h3>Status</h3>

          <h2>{data?.success ? "ACTIVE" : "FAILED"}</h2>
        </div>

        <div className="card">
          <h3>Escalation Level</h3>

          <h2>CRITICAL</h2>
        </div>
      </div>

      {/* Escalation Feed */}

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
          Live Escalation Feed
        </h2>

        <div className="feed-item">
          Flood escalation detected in South Mumbai
        </div>

        <div className="feed-item">
          Water shortage intelligence activated
        </div>

        <div className="feed-item">
          Ministerial execution request approved
        </div>

        <div className="feed-item">
          Multi-zone coordination initiated
        </div>

        <div className="feed-item">
          Governance stabilization sequence started
        </div>
      </div>

      {/* Raw Backend Data */}

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

export default EscalationView;