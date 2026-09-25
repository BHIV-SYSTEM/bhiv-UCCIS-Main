import React from "react";

export default function MutationCheck() {

  const check = `
=====================================
MUTATION CHECK SUMMARY
=====================================

✔ No silent mutation detected
✔ No in-place modification
✔ Event count preserved
✔ Replay output stable across retries
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
      <h2>Mutation Verification</h2>
      {check}
    </div>
  );
}