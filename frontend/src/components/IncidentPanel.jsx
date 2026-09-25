import { useEffect, useState } from "react";
import api from "../services/api";

function IncidentPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/incidents")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  // if (!data) {
  //   return <h3>Loading Incidents...</h3>;
  // }

  return (
    <div className="panel">

      <h2>Incident Dashboard</h2>

      <div className="panel-grid">

        <div className="incident-card incident-total">
          <h4>Total Incidents</h4>
          {/* <h1>{data.totalIncidents}</h1> */}
        </div>

        <div className="incident-card incident-open">
          <h4>Open Incidents</h4>
          {/* <h1>{data.openIncidents}</h1> */}
        </div>

        <div className="incident-card incident-resolved">
          <h4>Resolved Incidents</h4>
          {/* <h1>{data.resolvedIncidents}</h1> */}
        </div>

      </div>

    </div>
  );
}

export default IncidentPanel;