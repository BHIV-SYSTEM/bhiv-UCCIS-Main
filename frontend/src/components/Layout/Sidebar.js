import React from "react";

function Sidebar({
  loadPhase,
  refreshDashboard
}) {

  const phases = [

    {
      id: 1,
      name: "Ingestion"
    },

    {
      id: 2,
      name: "Intelligence"
    },

    {
      id: 3,
      name: "Multi-Zone"
    },

    {
      id: 4,
      name: "Governance"
    },

    {
      id: 5,
      name: "Lifecycle"
    },

    {
      id: 6,
      name: "Dashboard"
    },

    {
      id: 7,
      name: "Replay"
    },

    {
      id: 8,
      name: "Failure Engine"
    },

    {
      id: 9,
      name: "Tantra Flow"
    },

    {
      id: 10,
      name: "Simulation"
    }

  ];

  // return (

  //   <div className="sidebar">

  //     <h2>
  //       PHASES
  //     </h2>

  //     {
  //       phases.map((phase) => (

  //         <div
  //           key={phase.id}
  //           className="phase-item"
  //           onClick={() =>
  //             loadPhase(phase.id)
  //           }
  //         >

  //           <span>
  //             {phase.id}
  //           </span>

  //           {phase.name}

  //         </div>
  //       ))
  //     }

  //     <div className="quick-actions">

  //       <button
  //         onClick={
  //           refreshDashboard
  //         }
  //       >
  //         Refresh Data
  //       </button>

  //       <button>
  //         Export Report
  //       </button>

  //       <button>
  //         System Audit
  //       </button>

  //     </div>

  //   </div>
  // );
}

export default Sidebar;