import { useEffect, useState } from "react";

import {
  getReplayData
} from "../services/replayApi";

const useReplay = () => {
  const [replayData,
    setReplayData] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const loadReplay =
    async () => {
      try {
        const data =
          await getReplayData();

        setReplayData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadReplay();

    const interval =
      setInterval(
        loadReplay,
        5000
      );

    return () =>
      clearInterval(interval);
  }, []);

  return {
    replayData,
    loading
  };
};

export default useReplay;