export default function TelemetryTable({ data }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Telemetry Data</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Signal</th>
            <th>Type</th>
            <th>Value</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.signalId}</td>
              <td>{item.type}</td>
              <td>{item.value}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}