import { useEffect, useState } from "react";
import API from "../services/api";
import RuntimeLogs from "../dashboard/RuntimeLogs";

const RuntimeLogsPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadRuntime();
  }, []);

  const loadRuntime = async () => {
    try {
      const res = await API.get("/runtime");

      if (Array.isArray(res.data)) {
        setLogs(res.data);
      } else if (Array.isArray(res.data.data)) {
        setLogs(res.data.data);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error(err);

      // Demo data if backend fails
      setLogs([
        {
          id: 1,
          level: "INFO",
          module: "backend",
          message: "System initialized",
        },
        {
          id: 2,
          level: "INFO",
          module: "telemetry",
          message: "Stream started",
        },
      ]);
    }
  };

  return (
    <div>
      <RuntimeLogs data={logs} />
    </div>
  );
};

export default RuntimeLogsPage;