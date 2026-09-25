import { useEffect, useState } from "react";

import {
  getObservability
} from "../services/analyticsApi";

const useObservability =
  () => {
    const [metrics,
      setMetrics] =
      useState(null);

    const [loading,
      setLoading] =
      useState(true);

    const loadMetrics =
      async () => {
        try {
          const data =
            await getObservability();

          setMetrics(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
      loadMetrics();

      const interval =
        setInterval(
          loadMetrics,
          5000
        );

      return () =>
        clearInterval(interval);
    }, []);

    return {
      metrics,
      loading
    };
  };

export default useObservability;