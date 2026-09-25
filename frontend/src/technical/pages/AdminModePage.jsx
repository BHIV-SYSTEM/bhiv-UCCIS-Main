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

export default function AdminModePage() {

  const allowed =
    technicalAccessGuard();

  if (!allowed) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white p-10 rounded-2xl shadow-xl">

          <h1 className="text-4xl font-bold text-red-600">
            Access Restricted
          </h1>

          <p className="mt-4 text-gray-600">
            Admin Mode unavailable for governance users.
          </p>

        </div>

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

    <div className="min-h-screen bg-gray-100 p-6 space-y-6">

      <AdminModeBanner />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <TracePacketViewer
          packets={packets}
        />

        <ReplayContractViewer
          contracts={contracts}
        />

      </div>

      <ObservabilityPanel
        metrics={metrics}
      />

    </div>

  );

}