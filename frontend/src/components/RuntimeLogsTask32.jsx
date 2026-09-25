import React, { useEffect, useState } from "react";
import { getDashboard } from "../services/api";

const RuntimeLogsTask32 = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDashboard();

      setLogs(response.data?.recentExecutions || []);
    } catch (error) {
      console.error(error);
      setError("Failed to load runtime logs");
    } finally {
      setLoading(false);
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "ERROR":
      case "CRITICAL":
        return "#ff4d4f";
      case "WARN":
        return "#faad14";
      case "INFO":
      default:
        return "#52c41a";
    }
  };

  return (
    <div className="container" style={{ color: "white" }}>
      <h1>Runtime Logs</h1>

      {/* ACTION BAR */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={loadLogs} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Logs"}
        </button>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div style={{ color: "red", marginBottom: 10 }}>
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && logs.length === 0 && !error && (
        <div style={{ opacity: 0.7 }}>
          No runtime logs available.
        </div>
      )}

      {/* LOADING STATE */}
      {loading && <div>Loading logs...</div>}

      {/* TABLE */}
      {!loading && logs.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
              <th>ID</th>
              <th>Trace</th>
              <th>Type</th>
              <th>Message</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                style={{
                  borderBottom: "1px solid #222",
                  cursor: "pointer",
                }}
              >
                <td>{log.id}</td>

                {/* 🔥 TRACE CLICK DRILLDOWN READY */}
                <td
                  style={{ color: "#1890ff", cursor: "pointer" }}
                  onClick={() => {
                    navigator.clipboard.writeText(log.trace_id);
                    alert(`Trace ID copied: ${log.trace_id}`);
                  }}
                >
                  {log.trace_id}
                </td>

                {/* TYPE with severity color */}
                <td style={{ color: getColor(log.event_type) }}>
                  {log.event_type}
                </td>

                <td>{log.event_message}</td>

                <td style={{ opacity: 0.7 }}>
                  {log.created_at || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RuntimeLogsTask32;