import { useEffect, useState } from "react";

const TelemetryCard = () => {
  const [telemetry, setTelemetry] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/telemetry")
      .then((res) => res.json())
      .then((data) => {
        setTelemetry(data.data || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="card">
      <h2>Telemetry Events</h2>

      {telemetry.map((item) => (
        <div key={item.event_id}>
          <p>Event ID: {item.event_id}</p>
          <p>Status: {item.event_status}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default TelemetryCard;