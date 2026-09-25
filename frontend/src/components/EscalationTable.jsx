import React from "react";

function EscalationTable({ escalations = [] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Trace ID</th>
          <th>Level</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {escalations.length > 0 ? (
          escalations.map((escalation, index) => {
            const traceId =
              escalation?.trace_id ??
              escalation?.traceId ??
              `TRACE-${index + 1}`;

            const level =
              escalation?.escalation_level ??
              escalation?.escalationLevel ??
              escalation?.level ??
              escalation?.severity ??
              "N/A";

            const status =
              escalation?.status ??
              "N/A";

            return (
              <tr key={`${traceId}-${index}`}>
                <td style={{ color: "#000000"}} >
                  {traceId}
                </td>

                <td style={{ color: "#000000"}} >
                  {level}
                </td>

                <td style={{ color: "#000000"}} >
                  {status}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="3">
              No escalations available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default EscalationTable;