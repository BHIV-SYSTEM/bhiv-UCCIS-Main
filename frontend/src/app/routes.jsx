// src/app/routes.jsx

import React from "react";

import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

/* =========================
   PHASE 1 — CORE DASHBOARD
========================= */

import MinisterDashboard
from "../pages/MinisterDashboard";

import ReplayCenter
from "../pages/ReplayCenter";

/* =========================
   PHASE 2 — MINISTERIAL LAYER
========================= */

import MinisterOperationalCenter
from "../pages/MinisterOperationalCenter";

/* =========================
   PHASE 3 — SECRETARY LAYER
========================= */

import PrincipalSecretaryDashboard
from "../pages/PrincipalSecretaryDashboard";

/* =========================
   PHASE 4 — OSD + FIELD
========================= */

import OSDOperationalCenter
from "../pages/OSDOperationalCenter";

import FieldOperationsDashboard
from "../pages/FieldOperationsDashboard";

/* =========================
   PHASE 5 — REPLAY STORY
========================= */

import ReplayStoryPage
from "../pages/ReplayStoryPage";

/* =========================
   PHASE 6 — REPLAY VALIDATION
========================= */

import ReplayValidationPage
from "../pages/ReplayValidationPage";

/* =========================
   PHASE 7 — LIVE OPERATIONS
========================= */

import LiveOperationsPage
from "../pages/LiveOperationsPage";

/* =========================
   PHASE 8 — TECHNICAL LAYER
========================= */

import TechnicalInspectionPage
from "../technical/pages/TechnicalInspectionPage";

import AdminModePage
from "../technical/pages/AdminModePage";

import AuditModePage
from "../technical/pages/AuditModePage";

/* =========================
   PHASE 9 — RELIABILITY
========================= */

import ReliabilityOperationsPage
from "../pages/ReliabilityOperationsPage";

/* =========================
   PHASE 10 — PILOT PROOF
========================= */

import MinisterialPilotProofPage
from "../pages/MinisterialPilotProofPage";

/* =========================
   UNIFIED DASHBOARD
========================= */

import UCCISUnifiedDashboard
from "../pages/UCCISUnifiedDashboard";

export default function AppRoutes() {

  return (

    <Routes>

      {/* =========================
          DEFAULT LANDING
      ========================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/uccis-dashboard"
            replace
          />
        }
      />

      {/* =========================
          UNIFIED DASHBOARD
      ========================= */}

      <Route
        path="/uccis-dashboard"
        element={<UCCISUnifiedDashboard />}
      />

      {/* =========================
          PHASE 1 ROUTES
      ========================= */}

      <Route
        path="/dashboard"
        element={<MinisterDashboard />}
      />

      <Route
        path="/replay"
        element={<ReplayCenter />}
      />

      {/* =========================
          PHASE 2 ROUTE
      ========================= */}

      <Route
        path="/minister"
        element={<MinisterOperationalCenter />}
      />

      {/* =========================
          PHASE 3 ROUTE
      ========================= */}

      <Route
        path="/secretary"
        element={<PrincipalSecretaryDashboard />}
      />

      {/* =========================
          PHASE 4 ROUTES
      ========================= */}

      <Route
        path="/osd"
        element={<OSDOperationalCenter />}
      />

      <Route
        path="/field"
        element={<FieldOperationsDashboard />}
      />

      {/* =========================
          PHASE 5 ROUTE
      ========================= */}

      <Route
        path="/replay-story"
        element={<ReplayStoryPage />}
      />

      {/* =========================
          PHASE 6 ROUTE
      ========================= */}

      <Route
        path="/replay-validation"
        element={<ReplayValidationPage />}
      />

      {/* =========================
          PHASE 7 ROUTE
      ========================= */}

      <Route
        path="/live"
        element={<LiveOperationsPage />}
      />

      {/* =========================
          PHASE 8 ROUTES
      ========================= */}

      <Route
        path="/technical-inspection"
        element={<TechnicalInspectionPage />}
      />

      <Route
        path="/admin"
        element={<AdminModePage />}
      />

      <Route
        path="/audit"
        element={<AuditModePage />}
      />

      {/* =========================
          PHASE 9 ROUTE
      ========================= */}

      <Route
        path="/reliability"
        element={<ReliabilityOperationsPage />}
      />

      {/* =========================
          PHASE 10 ROUTE
      ========================= */}

      <Route
        path="/pilot-proof"
        element={<MinisterialPilotProofPage />}
      />

      {/* =========================
          FALLBACK ROUTE
      ========================= */}

      <Route
        path="*"
        element={

          <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-10 rounded-2xl shadow-xl text-center">

              <h1 className="text-6xl font-bold text-red-600">

                404

              </h1>

              <p className="mt-4 text-2xl font-semibold">

                Operational Route Not Found

              </p>

              <p className="mt-3 text-gray-500">

                Requested operational layer unavailable.

              </p>

            </div>

          </div>

        }
      />

    </Routes>

  );

}