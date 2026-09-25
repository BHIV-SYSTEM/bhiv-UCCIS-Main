import { useEffect, useState } from "react";

const useRuntimePolling = (
  url,
  interval = 5000
) => {

  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [lastUpdated, setLastUpdated] =
    useState(null);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const response =
            await fetch(url);

          const result =
            await response.json();

          setData(result);

          setLastUpdated(
            new Date().toLocaleTimeString()
          );

          setLoading(false);

        } catch (error) {

          console.error(error);

        }

      };

    fetchData();

    const runtime =
      setInterval(
        fetchData,
        interval
      );

    return () =>
      clearInterval(runtime);

  }, [url, interval]);

  return {
    data,
    loading,
    lastUpdated
  };

};

export default useRuntimePolling;