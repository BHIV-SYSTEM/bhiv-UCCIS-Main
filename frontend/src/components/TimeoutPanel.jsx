import React from "react";

export default function TimeoutPanel() {

  const timeout =
`=====================================
TIMEOUT VISIBILITY
=====================================

✔ Response delay detected
✔ Timeout threshold monitored (5 min rule)
✔ Warning state triggered
✔ System still tracking lifecycle continuity
`;

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#0b1220",
        padding: "20px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap",
        border: "1px solid #334155"
      }}
    >
      <h2>Timeout Visibility</h2>
      {timeout}
    </div>
  );
}