export default function RuntimeTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Signal</th>
          <th>Location</th>
          <th>Status</th>
          <th>Severity</th>
          <th>Escalation</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.signal_type}</td>
            <td>{item.district}</td>
            <td>{item.event_status}</td>
            <td>{item.severity}</td>
            <td>{item.escalated_to}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}