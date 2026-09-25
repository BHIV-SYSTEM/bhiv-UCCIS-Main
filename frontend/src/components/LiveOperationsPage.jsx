import React from "react";

/* =========================
   COMPONENTS (PHASE 7 UI)
========================= */

import LiveEscalationTicker from "../governance/components/live/LiveEscalationTicker";
import DistrictHeatMap from "../governance/components/live/DistrictHeatMap";
import FieldResponseTimers from "../governance/components/live/FieldResponseTimers";
import OperationalPulseWidget from "../governance/components/live/OperationalPulseWidget";
import ExecutionCounterStrip from "../governance/components/live/ExecutionCounterStrip";

/* =========================
   ENGINES (PHASE 7 LOGIC)
========================= */

import { liveEscalationTicker } from "../governance/live/liveEscalationTicker";
import { districtStressEngine } from "../governance/live/districtStressEngine";
import { fieldResponseTimerEngine } from "../governance/live/fieldResponseTimerEngine";
import { operationalPulseEngine } from "../governance/live/operationalPulseEngine";
import { executionCounterEngine } from "../governance/live/executionCounterEngine";

export default function LiveOperationsPage() {

  /* =========================
     LIVE ESCALATION DATA
  ========================= */

  const tickerRaw = [
    {
      message: "Flood alert detected near Kurla",
      district: "Kurla",
      timestamp: new Date(Date.now() - 2 * 60000),
      severity: "HIGH"
    },
    {
      message: "Traffic bottleneck impacting response units",
      district: "Thane",
      timestamp: new Date(Date.now() - 5 * 60000),
      severity: "MEDIUM"
    },
    {
      message: "Drainage system overload warning",
      district: "Dadar",
      timestamp: new Date(Date.now() - 8 * 60000),
      severity: "CRITICAL"
    }
  ];

  const ticker =
    liveEscalationTicker(tickerRaw);

  /* =========================
     DISTRICT STRESS DATA
  ========================= */

  const heat = districtStressEngine([
    {
      name: "Mumbai",
      incidents: 6,
      delays: 4,
      escalations: 5
    },
    {
      name: "Thane",
      incidents: 3,
      delays: 2,
      escalations: 2
    },
    {
      name: "Navi Mumbai",
      incidents: 2,
      delays: 1,
      escalations: 1
    }
  ]);

  /* =========================
     FIELD RESPONSE TIMERS
  ========================= */

  const timers =
    fieldResponseTimerEngine([
      {
        name: "Drainage Clearance",
        district: "Kurla",
        elapsed: 18,
        eta: 30
      },
      {
        name: "Traffic Diversion Setup",
        district: "Thane",
        elapsed: 25,
        eta: 40
      }
    ]);

  /* =========================
     OPERATIONAL PULSE
  ========================= */

  const pulse =
    operationalPulseEngine({
      escalations: 45,
      delays: 28,
      pending: 18
    });

  /* =========================
     EXECUTION COUNTERS
  ========================= */

  const counters =
    executionCounterEngine({
      active: 14,
      completed: 38,
      pending: 9
    });

  return (

    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* =========================
          HEADER
      ========================= */}

      <h1 className="text-4xl font-bold">
        Live Operational Control Layer
      </h1>

      <p className="text-gray-600">
        Continuous governance simulation — real-time operational state view
      </p>

      {/* =========================
          LIVE TICKER
      ========================= */}

      <LiveEscalationTicker items={ticker} />

      {/* =========================
          GRID SECTION
      ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <DistrictHeatMap data={heat} />

        <OperationalPulseWidget pulse={pulse} />

      </div>

      {/* =========================
          FIELD TIMERS
      ========================= */}

      <FieldResponseTimers tasks={timers} />

      {/* =========================
          EXECUTION COUNTERS
      ========================= */}

      <ExecutionCounterStrip stats={counters} />

    </div>

  );

}