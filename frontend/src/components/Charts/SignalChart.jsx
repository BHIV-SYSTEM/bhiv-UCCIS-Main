import React from "react";

const SignalChart = ({ signals = [] }) => {
  return (
    <div className="chart-card">
      <h3>Signal Activity</h3>

      {signals.length === 0 ? (
        <p>No Signals Available</p>
      ) : (
        signals.map((item, index) => (
          <div
            key={index}
            style={{
              marginTop: "12px",
              padding: "10px",
              background: "#0f172a",
              borderRadius: "8px"
            }}
          >
            <strong>{item.signalId}</strong>
            <p>{item.source}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SignalChart;