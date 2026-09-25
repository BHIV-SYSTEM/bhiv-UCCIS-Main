export default function RuntimeLogsTask28({ logs }) {

  return (
    <div className="panel">

      <h3>Runtime Logs</h3>

      {logs.map((log) => (
        <div key={log.id}>
          {log.message}
        </div>
      ))}

    </div>
  );
}