import React from "react";

function DependencyHealth() {

  const systems = [
    {
      name: "MongoDB",
      status: "Healthy"
    },
    {
      name: "Redis",
      status: "Healthy"
    },
    {
      name: "Kafka",
      status: "Warning"
    },
    {
      name: "Elastic",
      status: "Healthy"
    }
  ];

  return (
    <div className="panel">

      <h2>
        Dependency Health
      </h2>

      {systems.map(system => (
        <div
          key={system.name}
          className="dependency-row"
        >
          <span>
            {system.name}
          </span>

          <span>
            {system.status}
          </span>
        </div>
      ))}

    </div>
  );
}

export default DependencyHealth;