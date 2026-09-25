export default function ExecutionConsole({ logs }) {
  return (
    <div className="console">
      <h3>Execution Log</h3>

      {logs.map((l, i) => (
        <pre key={i}>
{JSON.stringify(l, null, 2)}
        </pre>
      ))}
    </div>
  );
}