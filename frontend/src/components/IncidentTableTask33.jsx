function IncidentTableTask33({
  incidents
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Trace ID</th>
          <th>Incident</th>
          <th>Severity</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {incidents?.map(
          (incident, index) => (
            <tr key={index}>
              <td>
                {incident.trace_id}
              </td>
              <td>
                {
                  incident.incident_type
                }
              </td>
              <td>
                {
                  incident.severity
                }
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

export default IncidentTableTask33;