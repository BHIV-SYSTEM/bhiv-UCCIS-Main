import ReactECharts from "echarts-for-react";

const ExecutiveKPIs = () => {

  const option = {

    tooltip: {},

    xAxis: {
      type: "category",

      data: [
        "Mumbai",
        "Thane",
        "MMR"
      ]
    },

    yAxis: {
      type: "value"
    },

    series: [
      {
        data: [92, 84, 76],

        type: "bar",

        smooth: true
      }
    ]
  };

  return (

    <div className="panel-card">

      <h2>
        Executive KPIs
      </h2>

      <ReactECharts
        option={option}
        style={{
          height: "300px"
        }}
      />

    </div>

  );

};

export default ExecutiveKPIs;