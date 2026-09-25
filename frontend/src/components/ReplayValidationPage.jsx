// src/pages/ReplayValidationPage.jsx

import React from "react";

import ReplayValidationDashboard
from "../governance/components/replayValidation/ReplayValidationDashboard";

import {
  distributedReplaySimulator
} from "../governance/replayValidation/distributedReplaySimulator";

import {
  replayIntegrityValidator
} from "../governance/replayValidation/replayIntegrityValidator";

export default function ReplayValidationPage() {

  const rawEvents = [

    {
      id: 1,
      timestamp: "2026-05-12T10:12:00Z",
      action: "ALERT"
    },

    {
      id: 2,
      timestamp: "2026-05-12T10:14:00Z",
      action: "ESCALATE"
    },

    {
      id: 3,
      timestamp: "2026-05-12T10:18:00Z",
      action: "DEPLOY"
    },

    {
      id: 4,
      timestamp: "2026-05-12T10:14:30Z", // intentional disorder
      action: "ACK"
    }

  ];

  const simulated =
    distributedReplaySimulator(rawEvents);

  const result =
    replayIntegrityValidator(simulated);

  return (

    <div className="p-6">

      <ReplayValidationDashboard
        result={result}
      />

    </div>

  );

}