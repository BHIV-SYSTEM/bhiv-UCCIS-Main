import { useEffect, useState } from "react";
import api from "../services/api";

function SignalTableTask34() {
  const [signals, setSignals] =
    useState([]);

  useEffect(() => {
    api
      .get("/signals/list")
      .then((res) =>
        setSignals(res.data)
      )
      .catch(console.error);
  }, []);

  return (
    <div className="runtime-logs">

      {/* <h2>Signal Backend Response</h2>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Trace ID</th>
            <th>Name</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {signals.map((signal) => (
            <tr key={signal.id}>
              <td>{signal.id}</td>

              <td>
                {signal.trace_id}
              </td>

              <td>
                {signal.signal_name}
              </td>

              <td>
                {signal.severity}
              </td>

              <td>
                {signal.status}
              </td>
            </tr>
          ))}

        </tbody>

      </table> */}

    </div>
  );
}

export default SignalTableTask34;