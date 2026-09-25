import { useState } from "react";

const RuntimeLogsTask30 = () => {

  const [logs, setLogs] = useState([]);

  const runScenario = async () => {

    const res = await fetch(
      "http://localhost:5000/api/runtime/flood-scenario"
    );

    const data = await res.json();

    setLogs(prev => [
      ...prev,
      {
        time: new Date().toLocaleTimeString(),
        message: data.message
      }
    ]);
  };

  // return (
  //   <div className="card">

  //     <h2>Runtime Logs</h2>

  //     <button onClick={runScenario}>
  //       Execute Scenario
  //     </button>

  //     {logs.map((log, index) => (
  //       <div key={index}>
  //         <p>
  //           {log.time} - {log.message}
  //         </p>
  //       </div>
  //     ))}

  //   </div>
  // );
};

export default RuntimeLogsTask30;