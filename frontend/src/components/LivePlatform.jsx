import { useEffect, useState } from "react";
import API from "../api";

import TelemetryTable from "../components/TelemetryTable.jsx";
import RuntimeLogs from "../components/RuntimeLogs.jsx";

export default function LivePlatform() {
  const [telemetry, setTelemetry] = useState([]);
  const [logs, setLogs] = useState([]);

  const loadData = async () => {
    try {
      const t = await API.get("/api/telemetry");
      const r = await API.get("/api/runtime");

      setTelemetry(t.data);
      setLogs(r.data);
    } catch (err) {
      console.log("API Error:", err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>📡 UCCIS Live Dashboard (Vite)</h2>

      <TelemetryTable data={telemetry} />
      <RuntimeLogs data={logs} />
    </div>
  );
}