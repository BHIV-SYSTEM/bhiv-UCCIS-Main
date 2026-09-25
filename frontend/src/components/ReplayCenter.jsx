// src/pages/ReplayCenter.jsx

import React from "react";

import AdministrativeTimeline
from "../components/governance/AdministrativeTimeline";

import { replayNarrativeBuilder }
from "../governance/transformers/replayNarrativeBuilder";

export default function ReplayCenter() {

  const rawEvents = [
    {
      time: "08:42 AM",
      type: "rainfall"
    },
    {
      time: "08:47 AM",
      type: "complaint"
    },
    {
      time: "09:02 AM",
      type: "dispatch"
    }
  ];

  const timeline =
    replayNarrativeBuilder(rawEvents);

  return (
    <div className="p-6">

      <AdministrativeTimeline
        timeline={timeline}
      />

    </div>
  );
}