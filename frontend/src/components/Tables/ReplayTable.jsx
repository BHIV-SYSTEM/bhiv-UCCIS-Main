import React from "react";

const ReplayTable = ({
  replays = []
}) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Replay ID</th>
            <th>Trace ID</th>
            <th>Status</th>
            <th>Duration</th>
          </tr>
        </thead>

        <tbody>
          {replays.map(item => (
            <tr key={item._id}>
              <td>{item.replayId}</td>
              <td>{item.traceId}</td>
              <td>{item.status}</td>
              <td>{item.duration} ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReplayTable;