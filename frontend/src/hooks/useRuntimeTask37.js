import {
  useEffect,
  useState
} from "react";

import api from "../services/api";

export default function useRuntimeTask37() {

  const [runtime,
    setRuntime] =
    useState(null);

  useEffect(() => {

    api
      .get("/runtime")
      .then((res) =>
        setRuntime(
          res.data
        )
      );

  }, []);

  return runtime;
}