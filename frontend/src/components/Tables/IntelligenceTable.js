import React from "react";

const data = [
  {
    zone: "47.5–48.0°N / 122.5–122.0°W",
    score: 100,
    trend: "Stationary Dominant",
    confidence: "99.77%",
  },
  {
    zone: "29.5–30.0°N / 90.5–90.0°W",
    score: 89.86,
    trend: "Stationary Dominant",
    confidence: "99.77%",
  },
  {
    zone: "29.5–30.0°N / 95.5–95.0°W",
    score: 77.19,
    trend: "Stationary Dominant",
    confidence: "99.77%",
  },
  {
    zone: "33.5–34.0°N / 118.5–118.0°W",
    score: 64.75,
    trend: "Stationary Dominant",
    confidence: "99.77%",
  },
  {
    zone: "40.5–41.0°N / 74.5–74.0°W",
    score: 53.46,
    trend: "Stationary Dominant",
    confidence: "99.77%",
  },
  {
    zone: "29.0–29.5°N / 95.0–94.5°W",
    score: 52.76,
    trend: "Moving Activity",
    confidence: "99.77%",
  },
  {
    zone: "37.5–38.0°N / 122.5–122.0°W",
    score: 52.07,
    trend: "Stationary Dominant",
    confidence: "99.77%",
  },
  {
    zone: "49.0–49.5°N / 123.5–123.0°W",
    score: 48.39,
    trend: "Stationary Dominant",
    confidence: "99.77%",
  },
  {
    zone: "32.5–33.0°N / 117.5–117.0°W",
    score: 44.24,
    trend: "Stationary Dominant",
    confidence: "99.77%",
  },
  {
    zone: "25.5–26.0°N / 80.5–80.0°W",
    score: 39.86,
    trend: "Stationary Dominant",
    confidence: "99.77%",
  },
];

function IntelligenceTable() {
  return (
    <div className="table-container">

      <h2>
        AIS Intelligence Summary
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

          {data.map((item, index) => (

            <tr key={index}>

              <td style={{ color: "#000000" }}>
                {item.zone}
              </td>

              <td
                style={{
                  color:
                    item.score >= 75
                      ? "#dc2626"
                      : item.score >= 50
                      ? "#d97706"
                      : "#000000",
                  fontWeight: 700,
                }}
              >
                {item.score}
              </td>

              <td style={{ color: "#000000" }}>
                {item.trend}
              </td>

              <td
                style={{
                  color: "#000000",
                  fontWeight: 600,
                }}
              >
                {item.confidence}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default IntelligenceTable;
