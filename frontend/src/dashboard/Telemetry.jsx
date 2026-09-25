import { useEffect, useState } from "react";
import API from "../services/api";

const Telemetry = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getTelemetry();
  }, []);

  const getTelemetry = async () => {
    const res = await API.get("/telemetry");
    setData(res.data.data || []);
  };

  // return (
  //   <div className="card">
  //     <h2>Telemetry Events</h2>

  //     {data.map((item) => (
  //       <div key={item.event_id}>
  //         <p>Event ID: {item.event_id}</p>
  //         <p>Status: {item.event_status}</p>
  //         <hr />
  //       </div>
  //     ))}

  //     <pre>{JSON.stringify(data, null, 2)}</pre>
  //   </div>
  // );
};

export default Telemetry;