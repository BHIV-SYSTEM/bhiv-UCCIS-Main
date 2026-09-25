import React from "react";

export default function JourneyFlow() {
  const steps = [
    {
      id: 1,
      title: "Signal Intake",
      desc: "Raw signals captured from field nodes",
      status: "active",
    },
    {
      id: 2,
      title: "Telemetry Capture",
      desc: "System metrics streamed in real-time",
      status: "active",
    },
    {
      id: 3,
      title: "Runtime Processing",
      desc: "Engine computes system state",
      status: "active",
    },
    {
      id: 4,
      title: "Incident Detection",
      desc: "Anomaly detection & alert generation",
      status: "warning",
    },
    {
      id: 5,
      title: "Decision Engine",
      desc: "AI-assisted recommendation layer",
      status: "active",
    },
    {
      id: 6,
      title: "Approval Layer",
      desc: "Human-in-the-loop validation",
      status: "pending",
    },
    {
      id: 7,
      title: "Execution",
      desc: "Action triggered in live system",
      status: "critical",
    },
    {
      id: 8,
      title: "Replay & Audit",
      desc: "Full timeline reconstruction stored",
      status: "stable",
    },
  ];

  return (
    <div className="journey-wrapper">
      <h2 className="journey-title">Operational Flow Pipeline</h2>

      <div className="journey-grid">
        {steps.map((step, index) => (
          <div key={step.id} className={`journey-card ${step.status}`}>
            <div className="journey-index">{index + 1}</div>

            <div className="journey-content">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>

            {index !== steps.length - 1 && (
              <div className="journey-arrow">➜</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}