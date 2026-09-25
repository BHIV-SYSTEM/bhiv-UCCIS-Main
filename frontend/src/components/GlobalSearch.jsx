import { useState } from "react";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");

  const searchData = {
    "TRACE-1001": {
      type: "Trace",
      status: "ACTIVE",
      domain: "FLOOD",
      events: 5
    },

    "INC-001": {
      type: "Incident",
      severity: "HIGH",
      status: "ACTIVE"
    },

    "REP-001": {
      type: "Replay",
      status: "SUCCESS",
      evidence: "EV-001"
    },

    "EV-001": {
      type: "Evidence",
      source: "Flood Sensor",
      status: "VERIFIED"
    }
  };

  const result =
    searchData[
      query.toUpperCase()
    ];

//   return (
//     <div className="panel">
//       <h2>Global Search</h2>

//       <input
//         className="search-box"
//         placeholder="TRACE-1001 / INC-001 / REP-001 / EV-001"
//         value={query}
//         onChange={(e) =>
//           setQuery(e.target.value)
//         }
//       />

//       <div
//         style={{
//           marginTop: "20px"
//         }}
//       >
//         {result ? (
//           <pre>
// {JSON.stringify(
//   result,
//   null,
//   2
// )}
//           </pre>
//         ) : (
//           query &&
//           "No record found"
//         )}
//       </div>
//     </div>
//   );
}