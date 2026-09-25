import { useEffect, useState } from "react";

import {
  getRuntimeEvents,
  getRuntimeMetrics
} from "../services/runtimeApi";

const useRuntime = () => {
  const [events, setEvents] =
    useState([]);

  const [metrics, setMetrics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const loadRuntime =
    async () => {
      try {
        const runtimeEvents =
          await getRuntimeEvents();

        const runtimeMetrics =
          await getRuntimeMetrics();

        setEvents(runtimeEvents);

        setMetrics(runtimeMetrics);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadRuntime();

    const interval =
      setInterval(
        loadRuntime,
        5000
      );

    return () =>
      clearInterval(interval);
  }, []);

  return {
    events,
    metrics,
    loading
  };
};

export default useRuntime;