function KPISection() {

  const kpis = [

    {
      name: "Replay Stability",
      value: "82%"
    },

    {
      name: "Telemetry Accuracy",
      value: "91%"
    },

    {
      name: "Recovery Integrity",
      value: "77%"
    },

    {
      name: "Governance Visibility",
      value: "69%"
    }

  ];

  return (

    <div style={panel}>

      <h2>
        KPI Section
      </h2>

      <div style={grid}>

        {kpis.map((item, index) => (

          <div
            key={index}
            style={kpiBox}
          >

            <h3>
              {item.name}
            </h3>

            <h1>
              {item.value}
            </h1>

          </div>

        ))}

      </div>

    </div>

  );

}

const panel = {

  background: "#102030",

  padding: "20px",

  borderRadius: "12px",

  border: "1px solid #1f3b57"
};

const grid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(4,1fr)",

  gap: "20px"
};

const kpiBox = {

  background: "#1e293b",

  padding: "20px",

  borderRadius: "10px",

  textAlign: "center"
};

export default KPISection;