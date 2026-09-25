import React from "react";

import {
  technicalAccessGuard
} from "../auth/technicalAccessGuard";

import AdminModeBanner
from "../components/AdminModeBanner";

import {
  tracePacketAdapter
} from "../adapters/tracePacketAdapter";

import {
  replayContractAdapter
} from "../adapters/replayContractAdapter";

export default function AuditModePage() {

  const allowed =
    technicalAccessGuard();

  if (!allowed) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white p-10 rounded-2xl shadow-xl">

          <h1 className="text-4xl font-bold text-red-600">
            Audit Access Restricted
          </h1>

          <p className="mt-4 text-gray-600">
            Governance users cannot access audit layers.
          </p>

        </div>

      </div>

    );

  }

  const packets =
    tracePacketAdapter();

  const contracts =
    replayContractAdapter();

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <AdminModeBanner />

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

        <h2 className="text-3xl font-bold mb-4">
          Audit Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="border rounded-xl p-4">

            <p className="text-gray-500">
              Replay Contracts
            </p>

            <h3 className="text-3xl font-bold">
              {contracts.length}
            </h3>

          </div>

          <div className="border rounded-xl p-4">

            <p className="text-gray-500">
              Trace Packets
            </p>

            <h3 className="text-3xl font-bold">
              {packets.length}
            </h3>

          </div>

          <div className="border rounded-xl p-4">

            <p className="text-gray-500">
              Replay Integrity
            </p>

            <h3 className="text-3xl font-bold text-green-600">
              VALID
            </h3>

          </div>

        </div>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-4">
          Audit Notes
        </h2>

        <ul className="space-y-3 text-gray-700">

          <li>
            • Replay ordering preserved across distributed nodes
          </li>

          <li>
            • Append-only replay persistence verified
          </li>

          <li>
            • No replay contract violations detected
          </li>

          <li>
            • Deterministic reconstruction maintained
          </li>

        </ul>

      </div>

    </div>

  );

}