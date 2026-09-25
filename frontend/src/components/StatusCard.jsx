import React from "react";

export default function StatusCard({ title, value }) {

  return (
    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #334155"
      }}
    >

      <h3>{title}</h3>

      <h1
        style={{
          marginTop: "10px",
          color: "#22c55e"
        }}
      >
        {value}
      </h1>

    </div>
  );

}