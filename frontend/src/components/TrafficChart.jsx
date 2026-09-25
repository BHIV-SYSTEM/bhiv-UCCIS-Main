import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const TrafficChart = ({ trafficData }) => {
  const data = {
    labels: trafficData.map((_, index) => `T${index + 1}`),
    datasets: [
      {
        label: "Traffic Trend",
        data: trafficData,
        borderWidth: 2,
        tension: 0.3
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
      <Line data={data} options={options} />
    </div>
  );
};

const styles = {
  chartContainer: {
    marginTop: "20px"
  }
};

export default TrafficChart;