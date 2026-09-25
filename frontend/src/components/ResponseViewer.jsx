import React from "react";

function ResponseViewer({ data }) {
  return (
    <div
      style={{
        background: "#0f172a",
        color: "white",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
        overflow: "auto"
      }}
    >
      <h3>Backend Response</h3>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default ResponseViewer;