import React from "react";

function Header({ runSimulation }) {

  return (

    <div className="header">

      <div>

        <h1>
          UCCIS Ministerial Dashboard
        </h1>

        <p>
          Urban Command & Control Intelligence System
        </p>

      </div>

      {/* <button
        className="simulation-btn"
        onClick={runSimulation}
      >

        ▶ Run Ministerial Simulation

      </button> */}

    </div>
  );
}

export default Header;