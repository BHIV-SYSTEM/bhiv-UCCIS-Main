import { useEffect, useState } from "react";
import API from "../services/api";

export default function SignalBackendResponse() {

  const [data, setData] =
    useState([]);

  useEffect(() => {

    API.get("/api/signals/all")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  return (
    <div className="backend-card">

      <h2>
        Backend Response
      </h2>

      <pre>
        {JSON.stringify(
          data,
          null,
          2
        )}
      </pre>

    </div>
  );
}