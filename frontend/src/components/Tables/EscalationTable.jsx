import React from "react";

const EscalationTable = ({
  escalations = []
}) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Escalation ID</th>
            <th>Incident ID</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {escalations.map(item => (
            <tr key={item._id}>
              <td>{item.escalationId}</td>
              <td>{item.incidentId}</td>
              <td>{item.priority}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EscalationTable;