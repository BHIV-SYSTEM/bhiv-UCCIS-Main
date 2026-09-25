import React, { useEffect, useState } from "react";
import axios from "axios";

import EnforcementTimeline from "../components/EnforcementTimeline";
import ContinuityLogPanel from "../components/ContinuityLogPanel";
import DownstreamPanel from "../components/DownstreamPanel";
import AckFlowCard from "../components/AckFlowCard";

export default function EnforcementDashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/enforcement");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#020617",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial"
      }}
    >
      <h1>Enforcement-Linked Continuity Validation (Phase 5)</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "15px",
          marginTop: "20px"
        }}
      >
        <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
          SIGNAL FLOW: ACTIVE
        </div>

        <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
          GOVERNANCE VISIBILITY: CONFIRMED
        </div>

        <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
          ENFORCEMENT LINKAGE: TRACKED
        </div>

        <div style={{ background: "#0f172a", padding: "15px", borderRadius: "10px" }}>
          REPLAY INTEGRITY: VERIFIED
        </div>
      </div>

      <AckFlowCard />

      <EnforcementTimeline log={data?.log} />

      <DownstreamPanel validation={data?.validation} />

      <ContinuityLogPanel validation={data?.validation} />
    </div>
  );
}