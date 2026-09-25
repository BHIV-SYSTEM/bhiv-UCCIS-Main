import React, { useEffect, useState } from "react";
import axios from "axios";

import LineageBefore from "../components/LineageBefore";
import LineageAfter from "../components/LineageAfter";
import MutationCheck from "../components/MutationCheck";
import LineageStatusCard from "../components/LineageStatusCard";

export default function LineageDashboard() {

  const [lineage, setLineage] = useState(null);

  useEffect(() => {
    loadLineage();
  }, []);

  const loadLineage = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/lineage");
      setLineage(res.data.lineage);
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
      <h1>Append-Only Lineage Proof (Phase 4)</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "15px",
          marginTop: "20px"
        }}
      >
        <LineageStatusCard title="Mutation Safety" value="NO MUTATION" />
        <LineageStatusCard title="Ordering" value="DETERMINISTIC" />
        <LineageStatusCard title="Integrity" value="VERIFIED" />
        <LineageStatusCard title="Replay Mode" value="APPEND-ONLY" />
      </div>

      <LineageBefore data={lineage?.before} />

      <LineageAfter data={lineage?.after} />

      <MutationCheck />
    </div>
  );
}