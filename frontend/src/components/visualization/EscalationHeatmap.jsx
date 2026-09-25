import ReactECharts from "echarts-for-react";

export default function EscalationHeatmap() {
  const option = {
    xAxis: {
      type: "category",
      data: ["Health", "Transport", "Energy"],
      axisLabel: { color: "#aaa" }
    },
    yAxis: {
      type: "category",
      data: ["Critical", "High", "Medium", "Low"],
      axisLabel: { color: "#aaa" }
    },
    visualMap: {
      min: 0,
      max: 10,
      inRange: {
        color: ["#0f1a2e", "#ffb020", "#ff4d4d"]
      }
    },
    series: [
      {
        type: "heatmap",
        data: [
          [0, 0, 6], [1, 0, 3], [2, 0, 5],
          [0, 1, 3], [1, 1, 7], [2, 1, 4],
          [0, 2, 2], [1, 2, 4], [2, 2, 6],
          [0, 3, 1], [1, 3, 2], [2, 3, 3]
        ],
        label: { show: true, color: "#fff" }
      }
    ]
  };

  return (
    <div className="bg-[#0b1220] border border-[#1f2a44] rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3">
        Escalation Heatmap
      </h3>

      <ReactECharts option={option} style={{ height: 260 }} />
    </div>
  );
}