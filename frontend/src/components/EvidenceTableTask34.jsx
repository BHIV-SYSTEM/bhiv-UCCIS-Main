import { useEffect, useState } from "react";
import api from "../services/api";

function EvidenceTableTask34() {

  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/evidence/list")
      .then((res) => {
        setRows(res.data || []);
      })
      .catch(console.error);
  }, []);

  // return (
  //   <div className="runtime-logs">

  //     <h2>Evidence Backend Response</h2>

  //     <table>

  //       <thead>
  //         <tr>
  //           <th>ID</th>
  //           <th>Trace ID</th>
  //           <th>Evidence Name</th>
  //           <th>Type</th>
  //           <th>Status</th>
  //         </tr>
  //       </thead>

  //       <tbody>

  //         {rows.length > 0 ? (
  //           rows.map((item) => (
  //             <tr key={item.id}>
  //               <td>{item.id}</td>
  //               <td>{item.trace_id}</td>
  //               <td>{item.evidence_name}</td>
  //               <td>{item.type}</td>
  //               <td>{item.status}</td>
  //             </tr>
  //           ))
  //         ) : (
  //           <tr>
  //             <td colSpan="5">
  //               No evidence data found
  //             </td>
  //           </tr>
  //         )}

  //       </tbody>

  //     </table>

  //   </div>
  // );
}

export default EvidenceTableTask34;