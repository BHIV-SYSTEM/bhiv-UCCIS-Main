import { useEffect, useState } from "react";
import api from "../services/api";

function useRuntimeDataTask34() {
  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState(null);

  const [error, setError] =
    useState(null);

  const fetchRuntimeData =
    async () => {
      try {
        setLoading(true);

        const response =
          await api.get(
            "/dashboard"
          );

        setData(response.data);

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchRuntimeData();
  }, []);

  return {
    loading,
    data,
    error,
    refresh: fetchRuntimeData
  };
}

export default useRuntimeDataTask34;