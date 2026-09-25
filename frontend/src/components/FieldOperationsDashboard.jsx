// src/pages/FieldOperationsDashboard.jsx

import React from "react";

import {
  fieldTaskAdapter
} from "../governance/adapters/fieldTaskAdapter";

import FieldTaskCard
from "../components/governance/FieldTaskCard";

import ETATracker
from "../components/governance/ETATracker";

import GeoLocationPanel
from "../components/governance/GeoLocationPanel";

import ProofUploadPanel
from "../components/governance/ProofUploadPanel";

import AcknowledgementFlowPanel
from "../components/governance/AcknowledgementFlowPanel";

import EscalationContactCard
from "../components/governance/EscalationContactCard";

export default function FieldOperationsDashboard() {

  const data =
    fieldTaskAdapter();

  const task =
    data.assignedTasks[0];

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-4xl font-bold">
        Field Operations Dashboard
      </h1>

      <FieldTaskCard
        task={task}
      />

      <ETATracker
        eta={task.eta}
      />

      <GeoLocationPanel
        location={task.location}
      />

      <ProofUploadPanel />

      <AcknowledgementFlowPanel
        acknowledgement={
          task.acknowledgement
        }
      />

      <EscalationContactCard
        contact={
          task.escalationContact
        }
      />

    </div>
  );
}