import React from "react";

import DashboardCards from "../components/DashboardCards";
import BarChartCard from "../components/BarChartCard";
import PieChartCard from "../components/PieChartCard";
import ActivityTable from "../components/ActivityTable";

export default function RuntimeDashboard() {
  return (
    <div className="dashboard">

      {/* =====================================================
          DASHBOARD HEADER
      ===================================================== */}

      <div className="dashboard-header">
        <h1>UCCIS Runtime Dashboard</h1>

        <p>
          Operational Monitoring • Runtime Analytics • Incident Tracking
        </p>
      </div>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="dashboard-kpi-section">
        <DashboardCards />
      </section>

      {/* =====================================================
          CHARTS
      ===================================================== */}

      <section className="charts">

        <div className="chart-wrapper">
          <BarChartCard />
        </div>

        <div className="chart-wrapper">
          <PieChartCard />
        </div>

      </section>

      {/* =====================================================
          RECENT ACTIVITY
      ===================================================== */}

      <section className="activity-section">
        <ActivityTable />
      </section>

      {/* =====================================================
          OPERATIONAL CHAIN
      ===================================================== */}

      <section className="flow-card">

        <h2>Operational Chain</h2>

        <p className="flow-description">
          Signal processing and runtime operational flow
        </p>

        <div className="flow">

          <div className="flow-item">
            <span>01</span>
            Signal
          </div>

          <div className="flow-arrow">
            →
          </div>

          <div className="flow-item">
            <span>02</span>
            Telemetry
          </div>

          <div className="flow-arrow">
            →
          </div>

          <div className="flow-item">
            <span>03</span>
            Incident
          </div>

          <div className="flow-arrow">
            →
          </div>

          <div className="flow-item">
            <span>04</span>
            Escalation
          </div>

          <div className="flow-arrow">
            →
          </div>

          <div className="flow-item">
            <span>05</span>
            Replay
          </div>

          <div className="flow-arrow">
            →
          </div>

          <div className="flow-item">
            <span>06</span>
            Runtime Log
          </div>

        </div>

      </section>

    </div>
  );
}