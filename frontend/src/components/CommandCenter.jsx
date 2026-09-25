// =========================================================
// FILE: frontend/src/pages/CommandCenter.jsx
// UCCIS — PHASE 1 + PHASE 2 + PHASE 3 + PHASE 4
// =========================================================

import TopNavigation from "../components/layout/TopNavigation";
import FooterStatus from "../components/layout/FooterStatus";

import KPICommandStrip from "../components/kpi/KPICommandStrip";

import MinisterLayer from "../components/roles/MinisterLayer";
import PSLayer from "../components/roles/PSLayer";
import OSDLayer from "../components/roles/OSDLayer";
import FieldLayer from "../components/roles/FieldLayer";

export default function CommandCenter() {

  return (
    <div className="cc-root">

      {/* ================================================= */}
      {/* PHASE 1 — CANONICAL COMMAND CENTER FOUNDATION    */}
      {/* ================================================= */}

      {/* 
        Unified operational repository

        Structure:
        - frontend/
        - backend/
        - replay/
        - observability/
        - review_packets/

        Goal:
        Single operational command surface
      */}

      {/* ================================================= */}
      {/* FIXED OPERATIONAL NAVIGATION                      */}
      {/* ================================================= */}

      <TopNavigation />

      {/* ================================================= */}
      {/* PHASE 2 — LOW-SCROLL COMMAND CENTER UX            */}
      {/* ================================================= */}

      {/* 
        One-screen operational awareness

        Includes:
        - KPI command strip
        - operational intelligence
        - escalation visibility
        - execution awareness
      */}

      {/* KPI STRIP */}
      <KPICommandStrip />

      {/* ================================================= */}
      {/* PHASE 3 — GOVERNMENT-GRADE VISUAL MATURITY        */}
      {/* ================================================= */}

      {/*
        UX maturity goals:
        - institutional feel
        - calm operational density
        - compact cards
        - spacing discipline
        - typography hierarchy
        - alignment consistency
      */}

      {/* ================================================= */}
      {/* PHASE 4 — ROLE-BASED OPERATIONAL COGNITION        */}
      {/* ================================================= */}

      {/*
        Minister Layer:
        - statewide priorities
        - crises
        - KPIs
        - budget impact
        - district heat visibility

        PS Layer:
        - operational bottlenecks
        - escalations
        - aging tasks
        - dependency failures
        - unresolved execution chains

        OSD Layer:
        - execution queues
        - assignment chains
        - workflow dependencies
        - field progress

        Field Layer:
        - task
        - ETA
        - acknowledgement
        - proof upload
        - escalation contact
      */}

      {/* ================================================= */}
      {/* ROLE-BASED OPERATIONAL GRID                       */}
      {/* ================================================= */}

      <div className="role-grid">

        {/* ============================================= */}
        {/* MINISTER COMMAND LAYER                        */}
        {/* ============================================= */}

        <MinisterLayer />

        {/* ============================================= */}
        {/* PRINCIPAL SECRETARY LAYER                     */}
        {/* ============================================= */}

        <PSLayer />

        {/* ============================================= */}
        {/* OSD EXECUTION LAYER                           */}
        {/* ============================================= */}

        <OSDLayer />

        {/* ============================================= */}
        {/* FIELD OPERATIONS LAYER                        */}
        {/* ============================================= */}

        <FieldLayer />

      </div>

      {/* ================================================= */}
      {/* GLOBAL OPERATIONAL FOOTER                        */}
      {/* ================================================= */}

      <FooterStatus />

    </div>
  );
}