// src/technical/pages/TechnicalInspectionPage.jsx

import React from "react";

import {
  technicalAccessGuard
} from "../auth/technicalAccessGuard";

import AdminModeBanner
from "../components/AdminModeBanner";

import TracePacketViewer
from "../components/TracePacketViewer";

import ReplayContractViewer
from "../components/ReplayContractViewer";

import ObservabilityPanel
from "../components/ObservabilityPanel";

import {
  tracePacketAdapter
} from "../adapters/tracePacketAdapter";

import {
  replayContractAdapter
} from "../adapters/replayContractAdapter";

import {
  observabilityAdapter
} from "../adapters/observabilityAdapter";

export default function TechnicalInspectionPage() {

  const allowed =
    technicalAccessGuard();

  if (!allowed) {

    return (

      <div className="p-10">

        <h1 className="text-4xl font-bold text-red-600">
          Access Restricted
        </h1>

        <p className="mt-4">
          Governance users cannot access
          technical inspection layers.
        </p>

      </div>

    );

  }

  const packets =
    tracePacketAdapter();

  const contracts =
    replayContractAdapter();

  const metrics =
    observabilityAdapter();

  return (

    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">

      <AdminModeBanner />

      <TracePacketViewer
        packets={packets}
      />

      <ReplayContractViewer
        contracts={contracts}
      />

      <ObservabilityPanel
        metrics={metrics}
      />

    </div>

  );

}