import React from "react";

import API from "../../services/api";

function RunSimulationButton() {

  const runSimulation = async () => {

    const response =
      await API.get(
        "/run-simulation"
      );

    console.log(
      response.data
    );

    alert(
      "Ministerial Simulation Executed"
    );
  };

  return (

    <button
      onClick={runSimulation}
      style={{
        padding: "12px",
        background: "#1677ff",
        color: "white",
        border: "none",
        cursor: "pointer"
      }}
    >

      Run Ministerial Simulation

    </button>
  );
}

export default RunSimulationButton;