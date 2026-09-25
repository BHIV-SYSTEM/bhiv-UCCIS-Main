import { useEffect, useState } from "react";
import API from "../api";

import StatCardTask26 from "../components/StatCardTask26";
import ReplayChart from "../components/ReplayChart";
import ReplayEvents from "../components/ReplayEvents";

export default function ReplayTask26() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchReplay = async () => {
      try {
        const res = await API.get("/runtime");

        const runtimeLogs = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.logs)
          ? res.data.logs
          : [];

        setLogs(runtimeLogs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReplay();
  }, []);

  const normalize = (v) => (v || "").toLowerCase();

  const errors = logs.filter(
    (l) => normalize(l.level) === "error"
  ).length;

  const warnings = logs.filter(
    (l) => normalize(l.level) === "warn"
  ).length;

  const info = logs.filter(
    (l) => normalize(l.level) === "info"
  ).length;

  const pieData = Object.values(
    logs.reduce((acc, log) => {
      const moduleName = log.module || "Unknown";

      if (!acc[moduleName]) {
        acc[moduleName] = {
          module: moduleName,
          count: 0,
        };
      }

      acc[moduleName].count++;

      return acc;
    }, {})
  );

  return (
    <div className="page">
      <h1>🔁 Replay Phase</h1>

      {/* <div className="grid">
        <StatCardTask26 title="Errors" value={errors} />
        <StatCardTask26 title="Warnings" value={warnings} />
        <StatCardTask26 title="Info" value={info} />
        <StatCardTask26 title="Total" value={logs.length} />
      </div> */}

      <ReplayChart data={pieData} />

      <ReplayEvents data={logs} />
    </div>
  );
}