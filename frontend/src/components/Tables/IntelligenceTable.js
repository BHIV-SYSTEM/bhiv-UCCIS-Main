import React from "react";

const data = [
  {
    zone: "South Mumbai",
    score: 55,
    trend: "Stable",
    confidence: "72%"
  },
  {
    zone: "Bandra",
    score: 28,
    trend: "Falling",
    confidence: "68%"
  }
];

function IntelligenceTable() {

  return (

    <div className="table-container">

      <h2>
        Intelligence Summary
      </h2>

      <table>

        <thead>

          <tr>

            <th>Zone</th>
            <th>Score</th>
            <th>Trend</th>
            <th>Confidence</th>

          </tr>

        </thead>

        <tbody>

          {
            data.map((item, index) => (

              <tr key={index}>

                <td style={{ color: "#000000" }}>{item.zone}</td>
                <td style={{ color: "#000000" }}>{item.score}</td>
                <td style={{ color: "#000000" }}>{item.trend}</td>
                <td style={{ color: "#000000" }}>{item.confidence}</td>

              </tr>
            ))
          }

        </tbody>

      </table>

    </div>
  );
}

export default IntelligenceTable;