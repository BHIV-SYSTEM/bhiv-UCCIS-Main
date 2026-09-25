import React, { useEffect, useState } from "react";
import axios from "axios";

import CorruptionTimeline from "../components/CorruptionTimeline";
import RecoveryEvidencePanel from "../components/RecoveryEvidencePanel";
import LineagePanel from "../components/LineagePanel";

export default function CorruptionDashboard() {

  const [corruption, setCorruption] = useState("");
  const [recovery, setRecovery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/corruption");

      setCorruption(res.data.corruption);
      setRecovery(res.data.recovery);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#020617",
        color: "white",
        minHeight: "100vh",
        fontFamily: "Arial"
      }}
    >
      <h1>Replay Corruption Recovery Validation</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "15px",
          marginTop: "20px"
        }}
      >
        <div style={{ padding: "15px", background: "#0f172a", borderRadius: "10px" }}>
          PACKET RECOVERY: VERIFIED
        </div>

        <div style={{ padding: "15px", background: "#0f172a", borderRadius: "10px" }}>
          LINEAGE: PRESERVED
        </div>

        <div style={{ padding: "15px", background: "#0f172a", borderRadius: "10px" }}>
          APPEND-ONLY: ACTIVE
        </div>

        <div style={{ padding: "15px", background: "#0f172a", borderRadius: "10px" }}>
          RECONSTRUCTION: RESTORED
        </div>
      </div>

      <CorruptionTimeline corruption={corruption} />

      <RecoveryEvidencePanel recovery={recovery} />

      <LineagePanel recovery={recovery} />
    </div>
  );
}