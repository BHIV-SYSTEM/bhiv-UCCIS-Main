import React, { useEffect, useState } from "react";

import axios from "axios";

import ReplayTimeline from "../components/ReplayTimeline";

export default function ReplayDashboardTask13() {

  const [replay, setReplay] = useState("");

  useEffect(() => {

    loadReplay();

  }, []);

  const loadReplay = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/replay"
      );

      setReplay(response.data.replay);

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
        background: "#0f172a",
        minHeight: "100vh",
        color: "white"
      }}
    >
      <h1>UCCIS Replay Reconstruction Dashboard</h1>

      <ReplayTimeline replay={replay} />
    </div>
  );
}