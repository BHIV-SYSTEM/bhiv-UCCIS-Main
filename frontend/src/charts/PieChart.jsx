import { Pie } from "react-chartjs-2";

function PieChart({ data }) {
  if (!data) return null;

  return (
    <Pie
      data={{
        labels: data.map((d) => d.domain),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor: ["#3B82F6", "#F59E0B", "#EF4444", "#10B981"],
          },
        ],
      }}
    />
  );
}

export default PieChart;