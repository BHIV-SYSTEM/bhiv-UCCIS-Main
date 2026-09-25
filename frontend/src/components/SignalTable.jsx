export default function SignalTable() {

  const signals = [
    {
      id: 1,
      type: "FIRE_ALERT",
      location: "Nashik",
      status: "ACTIVE"
    },
    {
      id: 2,
      type: "FLOOD_ALERT",
      location: "Pune",
      status: "ACTIVE"
    },
    {
      id: 3,
      type: "CYBER_ATTACK",
      location: "Mumbai",
      status: "CRITICAL"
    }
  ];

  return (
    <div className="table-card" style={{ color: "#000000"}}>

      <h2>Recent Signals</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {signals.map((signal)=>(
            <tr key={signal.id}>
              <td style={{ color: "#000000"}}>{signal.id}</td>
              <td style={{ color: "#000000"}}>{signal.type}</td>
              <td style={{ color: "#000000"}}>{signal.location}</td>
              <td style={{ color: "#000000"}}>{signal.status}</td>
            </tr>
          ))}

        </tbody>
      </table>

    </div>
  );
}