import { useEffect, useState } from "react";
import axios from "axios";

function Signals() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/signals")
      .then((res) => {
        setSignals(res.data.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="page">
      <h1>Signals</h1>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Source</th>
            <th>Confidence</th>
            <th>Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {signals.map((signal) => (
            <tr key={signal.id}>
              <td>{signal.id}</td>
              <td>{signal.type}</td>
              <td>{signal.source_id}</td>
              <td>{signal.confidence}</td>
              <td>{signal.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Signals;