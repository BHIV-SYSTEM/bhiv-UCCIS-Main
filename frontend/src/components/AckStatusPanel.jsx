import React from "react";

export default function AckStatusPanel() {

  const ack =
`=====================================
ACKNOWLEDGEMENT STATUS
=====================================

✔ Field unit received assignment
✔ Acknowledgement recorded successfully
✔ State preserved for replay continuity
✔ No loss in transmission chain
`;

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#1e293b",
        padding: "20px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap"
      }}
    >
      <h2>Acknowledgement Tracking</h2>
      {ack}
    </div>
  );
}