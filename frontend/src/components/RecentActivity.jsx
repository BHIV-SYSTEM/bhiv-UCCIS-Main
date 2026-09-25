function RecentActivity() {

  const activities = [
    {
      traceId: "TRACE-1001",
      event: "Flood Alert Created"
    },
    {
      traceId: "TRACE-1002",
      event: "Telemetry Received"
    },
    {
      traceId: "TRACE-1003",
      event: "Incident Opened"
    },
    {
      traceId: "TRACE-1004",
      event: "Replay Executed"
    }
  ];

  return (
    <div className="card">

      <h2>Recent Activity</h2>

      <table>

        <thead>
          <tr>
            <th>Trace ID</th>
            <th>Activity</th>
          </tr>
        </thead>

        <tbody>
          {activities.map((item) => (
            <tr key={item.traceId}>
              <td style={{ color: "#000000"}} >{item.traceId}</td>
              <td style={{ color: "#000000"}} >{item.event}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default RecentActivity;