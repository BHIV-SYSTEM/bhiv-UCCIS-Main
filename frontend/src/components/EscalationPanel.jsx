import { useEffect, useState } from "react";
import api from "../services/api";

function EscalationPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/escalations")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) {
    return <h3>Loading Escalations...</h3>;
  }

  return (
    <div className="panel">
      <h2>Escalation Dashboard</h2>

      <div className="panel-grid">

        <div className="escalation-card escalation-total">
          <h4>Total Escalations</h4>
          {/* <h1>{data.totalEscalations}</h1> */}
        </div>

        <div className="escalation-card escalation-active">
          <h4>Active Escalations</h4>
          {/* <h1>{data.activeEscalations}</h1> */}
        </div>

        <div className="escalation-card escalation-resolved">
          <h4>Resolved Escalations</h4>
          {/* <h1>{data.resolvedEscalations}</h1> */}
        </div>

      </div>
    </div>
  );
}

export default EscalationPanel;