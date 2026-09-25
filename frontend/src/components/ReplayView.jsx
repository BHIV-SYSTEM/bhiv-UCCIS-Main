import { useEffect, useState } from "react";
import axios from "axios";

import "../App.css";

function ReplayView() {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchReplayData();
  }, []);

  const fetchReplayData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/replay"
      );

      setData(response.data);

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch replay intelligence");

      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        Loading governance replay system...
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
        Governance Replay System
      </h1>

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "30px",
        }}
      >
        Timeline reconstruction and replay intelligence
      </p>

      {/* Cards */}

      <div className="grid-cards">
        <div className="card">
          <h3>Replay Available</h3>

          <h2>
            {data?.data?.replay_available ? "YES" : "NO"}
          </h2>
        </div>

        <div className="card">
          <h3>Timeline Events</h3>

          <h2>
            {data?.data?.timeline_events}
          </h2>
        </div>

        <div className="card">
          <h3>Completed Operations</h3>

          <h2>
            {data?.data?.completed_operations}
          </h2>
        </div>

        <div className="card">
          <h3>Status</h3>

          <h2>ACTIVE</h2>
        </div>
      </div>

      {/* Replay Feed */}

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
          Replay Timeline Feed
        </h2>

        {data?.data?.replay_feed?.map((item, index) => (
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

export default ReplayView;