// src/pages/ReplayStoryPage.jsx

import React from "react";

import ReplayStoryView
from "../governance/components/replay/ReplayStoryView";

import {
  replayStoryAdapter
} from "../governance/replay/replayStoryAdapter";

import {
  replayTimelineBuilder
} from "../governance/replay/replayTimelineBuilder";

export default function ReplayStoryPage() {

  const rawEvents = [
    {
      time: "10:12 AM",
      message:
        "Flooding alert detected near Kurla."
    },
    {
      time: "10:14 AM",
      message:
        "Escalation routed to regional operations."
    },
    {
      time: "10:18 AM",
      message:
        "Field drainage unit assigned."
    },
    {
      time: "10:31 AM",
      message:
        "Field acknowledgement received."
    },
    {
      time: "10:47 AM",
      message:
        "Water levels normalized."
    },
    {
      time: "10:52 AM",
      message:
        "Incident resolved."
    }
  ];

  const structured =
    replayStoryAdapter(rawEvents);

  const story =
    replayTimelineBuilder(structured);

  return (

    <div className="p-6">

      <h1 className="text-4xl font-bold mb-6">
        Replay Story Reconstruction
      </h1>

      <ReplayStoryView story={story} />

    </div>

  );

}