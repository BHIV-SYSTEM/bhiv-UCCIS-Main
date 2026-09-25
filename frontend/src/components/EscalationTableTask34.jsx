import { useEffect, useState } from "react";
import api from "../services/api";

function EscalationTableTask34() {

  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/escalations/list")
      .then((res) => {
        setRows(res.data || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="runtime-logs">

      <h2>Escalation Backend Response</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Trace ID</th>
            <th>Escalation</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {rows.length > 0 ? (
            rows.map((item) => (
              <tr key={item.id}>
                <td style={{ color: "#000000"}}>{item.id}</td>
                <td style={{ color: "#000000"}}>{item.trace_id}</td>
                <td style={{ color: "#000000"}}>{item.escalation_name}</td>
                <td style={{ color: "#000000"}}>{item.priority}</td>
                <td style={{ color: "#000000"}}>{item.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                No escalation data found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default EscalationTableTask34;