import { useEffect, useState } from "react";
import api from "../services/api";

function TelemetryTableTask34() {

  const [telemetry, setTelemetry] =
    useState([]);

  useEffect(() => {
    api
      .get("/telemetry/list")
      .then((res) =>
        setTelemetry(res.data)
      )
      .catch(console.error);
  }, []);

  return (
    <div className="runtime-logs">

      <h2>Telemetry Backend Response</h2>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Trace ID</th>
            <th>Source</th>
            <th>Status</th>
            <th>Latency</th>
          </tr>
        </thead>

        <tbody>

          {telemetry.map((item) => (
            <tr key={item.id}>
              <td style={{ color: "#000000"}}>{item.id}</td>
              <td style={{ color: "#000000"}}>{item.trace_id}</td>
              <td style={{ color: "#000000"}}>{item.source}</td>
              <td style={{ color: "#000000"}}>{item.status}</td>
              <td style={{ color: "#000000"}}>{item.latency}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default TelemetryTableTask34;