import { useEffect, useState } from "react";
import api from "../services/api";

function ObservabilityTable() {

  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/observability/list")
      .then((res) => {
        setRows(res.data || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="runtime-logs">

      <h2>Runtime Backend Response</h2>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Trace ID</th>
            <th>Module</th>
            <th>Status</th>
            <th>Latency</th>
          </tr>
        </thead>

        <tbody>

          {rows.length > 0 ? (
            rows.map((item) => (
              <tr key={item.id}>
                <td style={{ color: "#000000"}}>{item.id}</td>
                <td style={{ color: "#000000"}}>{item.trace_id}</td>
                <td style={{ color: "#000000"}}>{item.module}</td>
                <td style={{ color: "#000000"}}>{item.status}</td>
                <td style={{ color: "#000000"}}>{item.latency}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                No runtime data found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default ObservabilityTable;