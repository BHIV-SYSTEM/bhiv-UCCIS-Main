function TelemetryView({
  signals
}) {

  return (
    <div>

      <h2>
        Telemetry
      </h2>

      <table>

        <thead>

          <tr>
            <th>Trace ID</th>
            <th>Source</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {signals.map(
            (item) => (
              <tr
                key={
                  item.trace_id
                }
              >
                <td style={{ color: "#000000" }}>
                  {
                    item.trace_id
                  }
                </td>

                <td style={{ color: "#000000" }}>
                  {
                    item.source_system
                  }
                </td>

                <td style={{ color: "#000000" }}>
                  {
                    item.status
                  }
                </td>
              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );

}

export default TelemetryView;