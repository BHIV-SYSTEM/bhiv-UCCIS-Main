import React, { useEffect, useState } from "react";
import axios from "axios";

import OperatorNodesPanel from "../components/OperatorNodesPanel";
import StabilityInspectorLog from "../components/StabilityInspectorLog";
import ConsistencyProofPanel from "../components/ConsistencyProofPanel";
import StaleTelemetryPanel from "../components/StaleTelemetryPanel";
import DistributedStatusCards from "../components/DistributedStatusCards";

export default function StabilityDashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {
    loadStability();
  }, []);

  const loadStability = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stability");
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
      <h1>Distributed Observability Stability (Phase 7)</h1>

      <DistributedStatusCards />

      <OperatorNodesPanel nodes={data?.nodes} />

      <StabilityInspectorLog validation={data?.validation} />

      <ConsistencyProofPanel validation={data?.validation} />

      <StaleTelemetryPanel validation={data?.validation} />
    </div>
  );
}