import React from "react";

const RuntimeLogsTask31 = ({ logs = [] }) => {
  return (
    <div className="runtime-section">
      <div className="section-header">
        <h2>Runtime Logs</h2>
      </div>

      {logs.length === 0 ? (
        <div className="runtime-empty">
          <h3>No Runtime Logs Available</h3>
        </div>
      ) : (
        <div className="runtime-grid">
          {logs.map((log, index) => (
            <div
              key={log.id || index}
              className="runtime-card"
            >
              <div className="runtime-card-header">
                <h3>
                  {log.event ||
                    log.message ||
                    "Runtime Event"}
                </h3>

                <span
                  className={`runtime-status ${
                    log.status === "SUCCESS"
                      ? "success"
                      : log.status === "FAILED"
                      ? "failed"
                      : "pending"
                  }`}
                >
                  {log.status || "ACTIVE"}
                </span>
              </div>

              <div className="runtime-card-body">
                <p>
                  <strong>Log ID:</strong>{" "}
                  {log.id || "N/A"}
                </p>

                <p>
                  <strong>Source:</strong>{" "}
                  {log.source || "Signal Layer"}
                </p>

                <p>
                  <strong>Phase:</strong>{" "}
                  {log.phase || "Runtime Engine"}
                </p>

                <p>
                  <strong>Message:</strong>{" "}
                  {log.message || "No Message"}
                </p>

                <p>
                  <strong>Timestamp:</strong>{" "}
                  {log.timestamp ||
                    log.created_at ||
                    "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RuntimeLogsTask31;