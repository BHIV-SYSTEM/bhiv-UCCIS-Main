import React from "react";

function IncidentTable({ incidents = [] }) {
  return (
    <div className="card">
      <h2>Incidents</h2>

      <table width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {incidents.length > 0 ? (
            incidents.map((incident, index) => {
              // Get ID from whichever field exists
              const incidentId =
                incident?.incident_id ??
                incident?.id ??
                incident?._id ??
                `INC-${index + 1}`;

              // Get Type from whichever field exists
              const incidentType =
                incident?.type ??
                incident?.incidentType ??
                incident?.incident_type ??
                incident?.signal_type ??
                "Unknown";

              const severity = incident?.severity ?? "Unknown";

              const status = incident?.status ?? "Unknown";

              return (
                <tr key={`${incidentId}-${index}`}>
                  <td style={{ color: "#000000" }}>
                    {incidentId}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {incidentType}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {severity}
                  </td>

                  <td style={{ color: "#000000" }}>
                    {status}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="4"
                style={{
                  color: "#000000",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No incidents available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentTable;