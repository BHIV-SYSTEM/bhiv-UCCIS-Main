import { useEffect, useState } from "react";

import {
  getRuntimeSummary,
  getTraceIds,
  getHealth,
  getReplayData,
} from "../services/runtimeService";

function useRuntimeData() {
  const [summary, setSummary] = useState(null);
  const [signals, setSignals] = useState([]);
  const [health, setHealth] = useState(null);
  const [replay, setReplay] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);

    try {
      const [
        summaryResult,
        signalResult,
        healthResult,
        replayResult,
      ] = await Promise.allSettled([
        getRuntimeSummary(),
        getTraceIds(),
        getHealth(),
        getReplayData(),
      ]);

      // ==========================================
      // RUNTIME SUMMARY
      // ==========================================
      if (summaryResult.status === "fulfilled") {
        const result = summaryResult.value;

        console.log("TASK 33 SUMMARY RESPONSE:", result);

        setSummary(
          result?.summary ??
          result?.data?.summary ??
          result?.data ??
          result ??
          null
        );
      } else {
        console.error(
          "Runtime Summary Error:",
          summaryResult.reason
        );

        setSummary(null);
      }

      // ==========================================
      // TRACE IDS / SIGNALS
      // ==========================================
      if (signalResult.status === "fulfilled") {
        const result = signalResult.value;

        console.log("TASK 33 TRACE RESPONSE:", result);

        setSignals(
          result?.data ??
          result?.signals ??
          result?.data?.signals ??
          []
        );
      } else {
        console.error(
          "Trace IDs Error:",
          signalResult.reason
        );

        setSignals([]);
      }

      // ==========================================
      // HEALTH
      // ==========================================
      if (healthResult.status === "fulfilled") {
        const result = healthResult.value;

        console.log("TASK 33 HEALTH RESPONSE:", result);

        setHealth(
          result?.data ??
          result ??
          null
        );
      } else {
        console.error(
          "Health Error:",
          healthResult.reason
        );

        setHealth(null);
      }

      // ==========================================
      // REPLAY
      // ==========================================
      if (replayResult.status === "fulfilled") {
        const result = replayResult.value;

        console.log("TASK 33 REPLAY RESPONSE:", result);

        setReplay(
          result?.data ??
          result?.replay ??
          result?.data?.replay ??
          []
        );
      } else {
        console.error(
          "Replay Error:",
          replayResult.reason
        );

        setReplay([]);
      }

    } catch (error) {
      console.error(
        "Unexpected Runtime Hook Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Enable this later if you want auto-refresh:
    // const timer = setInterval(loadData, 10000);
    // return () => clearInterval(timer);
  }, []);

  return {
    summary,
    signals,
    replay,
    health,
    loading,
  };
}

export default useRuntimeData;