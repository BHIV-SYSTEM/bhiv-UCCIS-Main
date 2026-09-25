import React, { useEffect, useState } from "react";
import axios from "axios";

import FieldLifecycleTimeline from "../components/FieldLifecycleTimeline";
import AckStatusPanel from "../components/AckStatusPanel";
import TimeoutPanel from "../components/TimeoutPanel";
import AgingPanel from "../components/AgingPanel";
import FieldStatusCards from "../components/FieldStatusCards";

export default function FieldDashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {
    loadFieldData();
  }, []);

  const loadFieldData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/field");
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
      <h1>Field Acknowledgement Continuity (Phase 6)</h1>

      <FieldStatusCards />

      <FieldLifecycleTimeline lifecycle={data?.lifecycle} />

      <AckStatusPanel />

      <TimeoutPanel />

      <AgingPanel />
    </div>
  );
}