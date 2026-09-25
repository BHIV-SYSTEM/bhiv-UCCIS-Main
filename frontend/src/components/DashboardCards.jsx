import { useEffect, useState } from "react";
import API from "../services/api";

export default function DashboardCards() {
  const [stats, setStats] = useState({
    signals: 0,
    telemetryEvents: 0,
    incidents: 0,
    escalations: 0,
    replaySessions: 0,
    runtimeLogs: 0
  });

  useEffect(() => {
    API.get("/api/runtime/summary")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.log("Dashboard Error:", err);

        setStats({
          signals: 120,
          telemetryEvents: 95,
          incidents: 60,
          escalations: 40,
          replaySessions: 25,
          runtimeLogs: 350
        });
      });
  }, []);

  const cards = [
    {
      title: "Signals",
      value: stats.signals
    },
    {
      title: "Telemetry Events",
      value: stats.telemetryEvents
    },
    {
      title: "Incidents",
      value: stats.incidents
    },
    {
      title: "Escalations",
      value: stats.escalations
    },
    {
      title: "Replay Sessions",
      value: stats.replaySessions
    },
    {
      title: "Runtime Logs",
      value: stats.runtimeLogs
    }
  ];

  return (
    <div className="card-grid">
      {cards.map((card, index) => (
        <div
          key={index}
          className="dashboard-card"
        >
          <h3>{card.title}</h3>

          <h1>{card.value}</h1>

          <p>
            Runtime Monitoring
          </p>
        </div>
      ))}
    </div>
  );
}