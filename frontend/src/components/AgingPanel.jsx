import React from "react";

export default function AgingPanel() {

  const aging =
`=====================================
ESCALATION AGING
=====================================

✔ Task aging increasing over time
✔ Threshold warning triggered
✔ Escalation remains active
✔ No loss of lifecycle trace
`;

  return (
    <div
      style={{
        marginTop: "25px",
        background: "#0f172a",
        padding: "20px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap",
        border: "1px solid #334155"
      }}
    >
      <h2>Escalation Aging</h2>
      {aging}
    </div>
  );
}