import { useEffect, useState } from "react";

const IncidentCard = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data.data || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="card">
      <h2>Incidents</h2>

      {incidents.map((item) => (
        <div key={item.incident_id}>
          <p>ID: {item.incident_id}</p>
          <p>Severity: {item.severity}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default IncidentCard;