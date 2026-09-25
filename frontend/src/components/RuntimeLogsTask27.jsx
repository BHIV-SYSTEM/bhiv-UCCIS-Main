export default function RuntimeLogsTask27() {

  const logs = [
    "Signal FIRE_ALERT received",
    "Telemetry event generated",
    "Incident created",
    "Escalation initiated",
    "Replay generated",
    "Runtime log stored"
  ];

  return (
    <div className="logs-card">

      <h2>
        Runtime Logs
      </h2>

      {logs.map((log,index)=>(
        <p key={index}>
          {log}
        </p>
      ))}

    </div>
  );
}