import { useEffect, useState } from "react";

const SystemHealthTask31 = () => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="card">
      <h2>System Health</h2>

      <div className="health-grid">
        <div className="health-item">
          <h4>Backend Status</h4>
          <p>{health?.status || "Loading..."}</p>
        </div>

        <div className="health-item">
          <h4>Runtime</h4>
          <p>{health?.runtime || "ACTIVE"}</p>
        </div>

        <div className="health-item">
          <h4>Signal Layer</h4>
          <p>{health?.signal_layer || "READY"}</p>
        </div>

        <div className="health-item">
          <h4>Mode</h4>
          <p>{health?.mode || "DEMO"}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthTask31;