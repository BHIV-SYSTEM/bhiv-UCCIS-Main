import { useEffect, useState } from "react";
import API from "../services/api";

export default function RuntimeChain() {

  const [records, setRecords] = useState([]);

  useEffect(() => {

    API.get("/api/runtime/chain")
      .then((res) => setRecords(res.data));

  }, []);

  return (
    <div>

      <h2>Runtime Chain</h2>

      <pre>
        {JSON.stringify(records, null, 2)}
      </pre>

    </div>
  );
}