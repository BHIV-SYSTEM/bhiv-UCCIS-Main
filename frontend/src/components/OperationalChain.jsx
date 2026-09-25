import React from "react";

export default function OperationalChain() {
  const phases = [
    {
      title: "OBSERVE",
      nodes: ["Source", "Signal", "Telemetry", "Validation"],
      color: "#3b82f6",
    },
    {
      title: "RECOMMEND",
      nodes: ["Recommendation", "Escalation"],
      color: "#f59e0b",
    },
    {
      title: "APPROVE",
      nodes: ["Operator Review", "Decision"],
      color: "#22c55e",
    },
    {
      title: "EXECUTE",
      nodes: [
        "Intervention",
        "Dashboard Projection",
        "Replay",
        "Runtime Evidence",
      ],
      color: "#ef4444",
    },
  ];

  return (
    <div style={{ width: "100%", padding: "10px" }}>
      <h3 style={{ marginBottom: "16px" }}>Operational Chain</h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {phases.map((phase, index) => (
          <div
            key={index}
            style={{
              borderLeft: `6px solid ${phase.color}`,
              background: "#0f172a",
              padding: "14px",
              borderRadius: "10px",
              color: "white",
            }}
          >
            {/* PHASE TITLE */}
            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                color: phase.color,
                marginBottom: "8px",
              }}
            >
              {phase.title}
            </div>

            {/* FLOW NODES */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {phase.nodes.map((node, i) => (
                <React.Fragment key={i}>
                  <div
                    style={{
                      padding: "6px 10px",
                      background: "#1e293b",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  >
                    {node}
                  </div>

                  {i !== phase.nodes.length - 1 && (
                    <span style={{ color: "#94a3b8" }}>→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}