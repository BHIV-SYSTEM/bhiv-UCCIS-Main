import React from "react";

const ActiveOperations = () => {
  const operations = [
    {
      traceId: "TRACE-1001",
      status: "Running"
    },
    {
      traceId: "TRACE-1002",
      status: "Escalated"
    }
  ];

  return (
    <div className="panel">

      <h2>Active Operations</h2>

      <table>

        <thead>
          <tr>
            <th>Trace ID</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {operations.map(op => (
            <tr key={op.traceId}>
              <td>{op.traceId}</td>
              <td>{op.status}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default ActiveOperations;