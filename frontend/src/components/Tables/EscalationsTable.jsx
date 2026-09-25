export default function EscalationsTable({
  escalations
}) {
  return (
    <table className="uccis-table">

      <thead>
        <tr>
          <th>ID</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Assigned To</th>
        </tr>
      </thead>

      <tbody>

        {escalations.map(
          (item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.priority}</td>
              <td>{item.status}</td>
              <td>
                {item.assignedTo}
              </td>
            </tr>
          )
        )}

      </tbody>

    </table>
  );
}