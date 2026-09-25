// src/pages/OSDOperationalCenter.jsx

import React from "react";

import {
  osdAdapter
} from "../governance/adapters/osdAdapter";

import AssignmentQueuePanel
from "../components/governance/AssignmentQueuePanel";

import ExecutionDependencyPanel
from "../components/governance/ExecutionDependencyPanel";

import EscalationRoutingPanel
from "../components/governance/EscalationRoutingPanel";

import OperationalDelayPanel
from "../components/governance/OperationalDelayPanel";

export default function OSDOperationalCenter() {

  const data =
    osdAdapter();

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-4xl font-bold">
        OSD Operational Center
      </h1>

      <AssignmentQueuePanel
        queues={data.assignmentQueues}
      />

      <ExecutionDependencyPanel
        dependencies={data.executionDependencies}
      />

      <EscalationRoutingPanel
        routes={data.escalationRouting}
      />

      <OperationalDelayPanel
        delays={data.operationalDelays}
      />

    </div>
  );
}