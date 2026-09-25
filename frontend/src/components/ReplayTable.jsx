function ReplayTable({
  replays
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Trace ID</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {replays?.map(
          (replay, index) => (
            <tr key={index}>
              <td style={{ color: "#000000"}} >
                {replay.trace_id}
              </td>

              <td style={{ color: "#000000"}}>
                {
                  replay.replay_status
                }
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

export default ReplayTable;