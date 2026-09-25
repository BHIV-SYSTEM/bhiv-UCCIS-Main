import { useEffect, useState } from "react";
import api from "../services/api";

function ReplayTableTask34() {

  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/replay/list")
      .then((res) => {
        setRows(res.data || []);
      })
      .catch(console.error);
  }, []);

  // return (
  //   <div className="runtime-logs">

  //     <h2>Replay Backend Response</h2>

  //     <table>

  //       <thead>
  //         <tr>
  //           <th>ID</th>
  //           <th>Trace ID</th>
  //           <th>Replay Name</th>
  //           <th>Status</th>
  //           <th>Duration</th>
  //         </tr>
  //       </thead>

  //       <tbody>

  //         {rows.length > 0 ? (
  //           rows.map((item) => (
  //             <tr key={item.id}>
  //               <td>{item.id}</td>
  //               <td>{item.trace_id}</td>
  //               <td>{item.replay_name}</td>
  //               <td>{item.status}</td>
  //               <td>{item.duration}</td>
  //             </tr>
  //           ))
  //         ) : (
  //           <tr>
  //             <td colSpan="5">
  //               No replay data found
  //             </td>
  //           </tr>
  //         )}

  //       </tbody>

  //     </table>

  //   </div>
  // );
}

export default ReplayTableTask34;