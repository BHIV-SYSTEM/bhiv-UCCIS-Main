import { useEffect, useState } from "react";
import api from "../services/api";

function Incidents() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    api.get("/incidents")
      .then((res) => setIncidents(res.data));
  }, []);

  return (
    <div>
      <h2>Incidents</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.severity}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Incidents;