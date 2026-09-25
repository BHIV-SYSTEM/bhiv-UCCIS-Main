import React, {
  useEffect,
  useState
} from "react";

import API from "../services/api";

import ZoneHeatmap
from "../components/Operator/ZoneHeatmap";

import IntelligenceBreakdown
from "../components/Operator/IntelligenceBreakdown";

import ExecutionTimeline
from "../components/Operator/ExecutionTimeline";

function OperatorDashboard() {

  const [intelligence, setIntelligence] =
    useState([]);

  const [lifecycle, setLifecycle] =
    useState([]);

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData = async () => {

    const intelligenceResponse =
      await API.get("/intelligence");

    const lifecycleResponse =
      await API.get("/lifecycle");

    setIntelligence(
      intelligenceResponse
      .data
      .data
      .intelligence
    );

    setLifecycle(
      lifecycleResponse
      .data
      .data
    );
  };

  return (

    <div className="p-5">

      <h1>
        UCCIS Operator Dashboard
      </h1>

      <ZoneHeatmap
        intelligence={intelligence}
      />

      <IntelligenceBreakdown
        intelligence={intelligence}
      />

      <ExecutionTimeline
        lifecycle={lifecycle}
      />

    </div>
  );
}

export default OperatorDashboard;