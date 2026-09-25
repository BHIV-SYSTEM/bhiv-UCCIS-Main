import { useEffect, useState } from "react";
import api from "../services/api";

function IncidentTableTask34() {

  const [incidents, setIncidents] =
    useState([]);

  useEffect(() => {
    api.get("/incidents/list")
      .then((res) => setIncidents(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="runtime-logs">

      <h2>Incident Backend Response</h2>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Trace ID</th>
            <th>Incident</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {incidents.map((item) => (
            <tr key={item.id}>
              <td style={{ color: "#000000"}}>{item.id}</td>
              <td style={{ color: "#000000"}}>{item.trace_id}</td>
              <td style={{ color: "#000000"}}>{item.incident_name}</td>
              <td style={{ color: "#000000"}}>{item.priority}</td>
              <td style={{ color: "#000000"}}>{item.status}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default IncidentTableTask34;