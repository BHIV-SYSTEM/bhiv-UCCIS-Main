import { Doughnut } from "react-chartjs-2";

function DonutChart({ data }) {
  if (!data) return null;

  return (
    <Doughnut
      data={{
        labels: data.map((d) => d.domain),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor: ["#6366F1", "#22C55E", "#F97316", "#EF4444"],
          },
        ],
      }}
    />
  );
}

export default DonutChart;