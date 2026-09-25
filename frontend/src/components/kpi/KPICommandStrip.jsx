export default function KPICommandStrip() {

  const kpis = [
    { title: "Incidents", value: 12 },
    { title: "Escalations", value: 3 },
    { title: "Replay Queue", value: 5 },
    { title: "Field Delays", value: 7 },
    { title: "Task Load", value: 248 }
  ];

  return (
    <div className="kpi-strip">

      {kpis.map((item, index) => (
        <div className="kpi-card" key={index}>
          <p>{item.title}</p>
          <h2>{item.value}</h2>
        </div>
      ))}

    </div>
  );
}