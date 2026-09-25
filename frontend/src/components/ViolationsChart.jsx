import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const ViolationsChart = ({ violationsData }) => {
  const data = {
    labels: violationsData.map((_, index) => `T${index + 1}`),
    datasets: [
      {
        label: "Violations",
        data: violationsData,
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

const styles = {
  chartContainer: {
    marginTop: "20px"
  }
};

export default ViolationsChart;