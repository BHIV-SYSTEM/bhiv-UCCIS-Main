import React from "react";

function GovernanceTable() {

  const data = [
    {
      domain: "Flooding",
      zone: "South Mumbai",
      action: "Drainage Emergency",
      state: "APPROVED"
    },
    {
      domain: "Traffic",
      zone: "Bandra",
      action: "Diversion Plan",
      state: "HOLD"
    }
  ];

  return (

    <div className="table-container">

      <h2>
        Governance Actions
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

          {
            data.map((item, index) => (

              <tr key={index}>

                <td style={{ color: "#000000" }}>{item.domain}</td>
                <td style={{ color: "#000000" }}>{item.zone}</td>
                <td style={{ color: "#000000" }}>{item.action}</td>
                <td style={{ color: "#000000" }}>{item.state}</td>

              </tr>
            ))
          }

        </tbody>

      </table>

    </div>
  );
}

export default GovernanceTable;