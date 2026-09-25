import React from "react";

export default function CorruptionTimeline({ corruption }) {

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
      <h2>Corruption Event Stream</h2>
      {corruption}
    </div>
  );
}