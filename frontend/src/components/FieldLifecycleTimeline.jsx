import React from "react";

export default function FieldLifecycleTimeline({ lifecycle }) {

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#111827",
        padding: "20px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap"
      }}
    >
      <h2>Field Lifecycle Timeline</h2>
      {lifecycle}
    </div>
  );
}