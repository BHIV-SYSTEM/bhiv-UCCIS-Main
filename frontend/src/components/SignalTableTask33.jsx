function SignalTableTask33({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Trace ID</th>
          <th>Signal Type</th>
          <th>Severity</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {data?.map((item) => (
          <tr key={item.trace_id}>
            <td>{item.trace_id}</td>
            <td>{item.signal_type}</td>
            <td>{item.severity}</td>
            <td>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SignalTableTask33;