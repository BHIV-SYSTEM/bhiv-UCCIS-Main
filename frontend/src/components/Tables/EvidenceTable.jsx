import React from "react";

const EvidenceTable = ({
  evidences = []
}) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Evidence ID</th>
            <th>Replay ID</th>
            <th>Trace ID</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {evidences.map(item => (
            <tr key={item._id}>
              <td>{item.evidenceId}</td>
              <td>{item.replayId}</td>
              <td>{item.traceId}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EvidenceTable;