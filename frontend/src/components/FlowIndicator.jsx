import React from "react";

const FlowIndicator = ({ flowStep }) => {

  const steps = [
    "Signal",
    "Alert",
    "Recommendation",
    "Request",
    "Decision",
    "State Update"
  ];

  const activeIndex = {
    REQUEST: 3,
    WAITING: 4,
    DONE: 5
  }[flowStep] ?? -1;

  return (
    <div style={{
      marginTop: "15px",
      fontSize: "12px",
      color: "#ccc"
    }}>
      {steps.map((step, index) => (
        <span key={index}>
          <span style={{
            color: index <= activeIndex ? "#4ade80" : "#555"
          }}>
            {step}
          </span>
          {index < steps.length - 1 && " → "}
        </span>
      ))}
    </div>
  );
};

export default FlowIndicator;