export default function IncidentsTable({
  incidents
}) {
  return (
    <table className="uccis-table">

      <thead>
        <tr>
          <th>Incident ID</th>
          <th>Trace ID</th>
          <th>Severity</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>

        {incidents.map(
          (incident) => (
            <tr key={incident.incidentId}>
              <td>
                {incident.incidentId}
              </td>

              <td>
                {incident.traceId}
              </td>

              <td>
                {incident.severity}
              </td>

              <td>
                {incident.status}
              </td>
            </tr>
          )
        )}

      </tbody>

    </table>
  );
}