import React from "react";

const IncidentTable = ({
  incidents = []
}) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Incident ID</th>
            <th>Trace ID</th>
            <th>Status</th>
            <th>Severity</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map(item => (
            <tr key={item._id}>
              <td>{item.incidentId}</td>
              <td>{item.traceId}</td>
              <td>{item.status}</td>
              <td>{item.severity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentTable;