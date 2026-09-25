import React, { useEffect, useState } from "react";

import axios from "axios";

import ConcurrentTimeline from "../components/ConcurrentTimeline";

import ReconciliationPanel from "../components/ReconciliationPanel";

import StatusCard from "../components/StatusCard";

export default function ConcurrentDashboard() {

  const [simulation, setSimulation] = useState("");

  const [reconciliation, setReconciliation] = useState("");

  useEffect(() => {

    loadConcurrentData();

  }, []);

  const loadConcurrentData = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/concurrent"
      );

      setSimulation(response.data.simulation);

      setReconciliation(response.data.reconciliation);

    } catch (error) {

      console.log(error);

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

      <h1>Concurrent Operator Simulation</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >

        <StatusCard
          title="Distributed Operators"
          value="ACTIVE"
        />

        <StatusCard
          title="Conflict Detection"
          value="RUNNING"
        />

        <StatusCard
          title="Replay Synchronization"
          value="VERIFIED"
        />

        <StatusCard
          title="Deterministic Ordering"
          value="STABLE"
        />

      </div>

      <ConcurrentTimeline simulation={simulation} />

      <ReconciliationPanel reconciliation={reconciliation} />

    </div>
  );

}