import { Line } from "react-chartjs-2";

function LineChart({ data }) {
  if (!data) return null;

  return (
    <Line
      data={{
        labels: data.map((d) => d.domain),
        datasets: [
          {
            label: "Trend",
            data: data.map((d) => d.value),
            borderColor: "#10B981",
            tension: 0.4,
            fill: false,
          },
        ],
      }}
      options={{
        responsive: true,
      }}
    />
  );
}

export default LineChart;