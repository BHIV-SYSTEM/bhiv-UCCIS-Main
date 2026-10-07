import React from "react";

function GovernanceTable() {

  const data = [
    {
      domain: "Vessel Activity",
      zone: "47.5–48.0°N / 122.5–122.0°W",
      action: "Monitor Stationary Concentration",
      state: "HIGH PRIORITY",
    },
    {
      domain: "Vessel Activity",
      zone: "29.5–30.0°N / 90.5–90.0°W",
      action: "Monitor Vessel Activity",
      state: "HIGH PRIORITY",
    },
    {
      domain: "Vessel Activity",
      zone: "29.5–30.0°N / 95.5–95.0°W",
      action: "Monitor Stationary Concentration",
      state: "HIGH PRIORITY",
    },
    {
      domain: "Vessel Activity",
      zone: "33.5–34.0°N / 118.5–118.0°W",
      action: "Monitor Vessel Concentration",
      state: "HIGH PRIORITY",
    },
    {
      domain: "Vessel Activity",
      zone: "40.5–41.0°N / 74.5–74.0°W",
      action: "Monitor High-Speed Activity",
      state: "HIGH PRIORITY",
    },
    {
      domain: "Vessel Activity",
      zone: "29.0–29.5°N / 95.0–94.5°W",
      action: "Review Vessel Activity",
      state: "REVIEW",
    },
    {
      domain: "Vessel Activity",
      zone: "37.5–38.0°N / 122.5–122.0°W",
      action: "Monitor High-Speed Activity",
      state: "HIGH PRIORITY",
    },
    {
      domain: "Vessel Activity",
      zone: "49.0–49.5°N / 123.5–123.0°W",
      action: "Monitor Stationary Concentration",
      state: "HIGH PRIORITY",
    },
    {
      domain: "Vessel Activity",
      zone: "32.5–33.0°N / 117.5–117.0°W",
      action: "Monitor Stationary Concentration",
      state: "HIGH PRIORITY",
    },
    {
      domain: "Vessel Activity",
      zone: "25.5–26.0°N / 80.5–80.0°W",
      action: "Review Vessel Activity",
      state: "REVIEW",
    },
  ];

  return (
    <div className="table-container">

      <h2>
        AIS Governance Actions
      </h2>

      <table>

        <thead>
          <tr>
            <th>Domain</th>
            <th>Zone</th>
            <th>Action</th>
            <th>State</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>

              <td style={{ color: "#000000" }}>
                {item.domain}
              </td>

              <td style={{ color: "#000000" }}>
                {item.zone}
              </td>

              <td style={{ color: "#000000" }}>
                {item.action}
              </td>

              <td
                style={{
                  color:
                    item.state === "HIGH PRIORITY"
                      ? "#dc2626"
                      : "#d97706",
                  fontWeight: 700,
                }}
              >
                {item.state}
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default GovernanceTable;
