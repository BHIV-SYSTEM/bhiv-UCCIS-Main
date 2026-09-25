import React from "react";

import { useNavigate } from "react-router-dom";

const phases = [
  "replay",
  "concurrency",
  "corruption",
  "lineage",
  "enforcement",
  "field",
  "stability",
  "governance",
  "failure",
  "final"
];

export default function Sidebar({ phase }) {

  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "260px",
        background: "#0f172a",
        padding: "20px",
        borderRight: "1px solid #334155"
      }}
    >
      <h2>UCCIS Replay System</h2>

      <div style={{ marginTop: "30px" }}>

        {phases.map((p, index) => (

          <div
            key={index}
            onClick={() => navigate(`/phase/${p}`)}
            style={{
              padding: "14px",
              marginBottom: "10px",
              background:
                phase === p
                  ? "#2563eb"
                  : "#1e293b",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            PHASE {index + 1} — {p.toUpperCase()}
          </div>

        ))}

      </div>
    </div>
  );
}