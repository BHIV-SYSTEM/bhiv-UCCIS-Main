import React from "react";

function RecentAlerts() {

  const alerts = [
    {
      id: "INC-1001",
      severity: "Critical",
      service: "Payment API"
    },
    {
      id: "INC-1002",
      severity: "High",
      service: "Runtime Engine"
    },
    {
      id: "INC-1003",
      severity: "Medium",
      service: "Telemetry"
    }
  ];

  return (
    <div className="panel">

      <h2>
        Recent Alerts
      </h2>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Severity</th>
            <th>Service</th>
          </tr>
        </thead>

        <tbody>

          {alerts.map(alert => (
            <tr key={alert.id}>
              <td>{alert.id}</td>
              <td>{alert.severity}</td>
              <td>{alert.service}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default RecentAlerts;