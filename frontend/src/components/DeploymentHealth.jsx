export default function DeploymentHealth() {
  const services = [
    "Backend",
    "Database",
    "Replay Engine",
    "Analytics",
    "Signal Layer"
  ];

  // return (
  //   <div className="panel">
  //     <h2>Deployment Health</h2>

  //     {services.map((service) => (
  //       <div className="row" key={service}>
  //         <span>{service}</span>
  //         <span>ONLINE</span>
  //       </div>
  //     ))}
  //   </div>
  // );
}