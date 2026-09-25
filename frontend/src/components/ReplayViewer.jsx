import { useEffect, useState } from "react";
import API from "../services/api";

export default function ReplayViewer() {

  const [replays, setReplays] = useState([]);

  useEffect(() => {

    API.get("/api/runtime/chain")
      .then((res) => setReplays(res.data));

  }, []);

  return (
    <div>

      <h2>Replay Viewer</h2>

      <pre>
        {JSON.stringify(replays, null, 2)}
      </pre>

    </div>
  );
}