export default function DependencyMonitor({
  dependencies
}) {
  return (
    <div className="card">
      <h2>Dependency Monitor</h2>

      {
        dependencies.map(dep => (
          <p key={dep.service}>
            {dep.service} : {dep.status}
          </p>
        ))
      }
    </div>
  );
}