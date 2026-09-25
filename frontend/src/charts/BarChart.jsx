import { Bar } from "react-chartjs-2";

function BarChart({ data }) {
  if (!data) return null;

  return (
    <Bar
      data={{
        labels: data.map((d) => d.domain),
        datasets: [
          {
            label: "Signal Strength",
            data: data.map((d) => d.value),
            backgroundColor: "#4F46E5",
            borderRadius: 6,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      }}
    />
  );
}

export default BarChart;