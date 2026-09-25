import React, { useEffect, useMemo, useState } from "react";



function parseCSVLine(line) {
  const values = [];
  let current = "";
  let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) { values.push(current.trim()); current = ""; }
    else current += char;
  }
  values.push(current.trim());
  return values;
}

function parseAISCSV(text) {
  const lines = String(text || "").split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/^\uFEFF/, "").trim());
  return lines.slice(1).map(line => {
    const vals = parseCSVLine(line); const row = {};
    headers.forEach((h, i) => { row[h] = vals[i] ?? ""; });
    return row;
  });
}

function field(row, names) {
  for (const name of names) {
    if (row?.[name] !== undefined && String(row[name]).trim() !== "") return String(row[name]).trim();
  }
  return "";
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

// Safely normalize values used in dynamic CSS class names.
// This prevents runtime errors when an API/data value is missing.
const safeClassName = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

export default function ExecutiveOverview() {
  const [showPerformanceDetails, setShowPerformanceDetails] =
    useState(false);

  const [showDepartmentCompare, setShowDepartmentCompare] =
    useState(false);

  const [showPortfolio, setShowPortfolio] =
    useState(false);

  const [aisData, setAISData] = useState([]);
  const [aisStatus, setAISStatus] = useState("LOADING");

  useEffect(() => {
    let mounted = true;
    fetch("/AIS_file.csv", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`AIS_file.csv returned ${response.status}`);
        return response.text();
      })
      .then((text) => {
        if (!mounted) return;
        const parsed = parseAISCSV(text);
        setAISData(parsed);
        setAISStatus(parsed.length ? "CONNECTED" : "NO DATA");
      })
      .catch((error) => {
        console.error("ExecutiveOverview AIS error:", error);
        if (mounted) setAISStatus("ERROR");
      });
    return () => { mounted = false; };
  }, []);

  const aisMetrics = useMemo(() => {
    const vessels = new Set();
    const types = new Set();
    let coordinates = 0, speeds = 0, timestamps = 0, speedTotal = 0;
    aisData.forEach((row) => {
      const mmsi = field(row, ["MMSI", "mmsi", "Mmsi"]);
      if (mmsi) vessels.add(mmsi);
      const type = field(row, ["VesselType", "Vessel Type", "vessel_type", "vesselType"]);
      if (type) types.add(type);
      const lat = Number(field(row, ["LAT", "Lat", "Latitude", "latitude"]));
      const lon = Number(field(row, ["LON", "Lon", "Longitude", "longitude"]));
      if (Number.isFinite(lat) && Number.isFinite(lon)) coordinates++;
      const sog = Number(field(row, ["SOG", "sog", "Speed", "speed"]));
      if (Number.isFinite(sog) && sog >= 0) { speeds++; speedTotal += sog; }
      const stamp = field(row, ["BaseDateTime", "baseDateTime", "Timestamp", "timestamp", "DateTime"]);
      if (stamp && Number.isFinite(new Date(stamp).getTime())) timestamps++;
    });
    const records = aisData.length;
    return { records, vessels: vessels.size, types: types.size, coordinates, speeds, timestamps, averageSOG: speeds ? speedTotal / speeds : 0 };
  }, [aisData]);

  const derived = useMemo(() => {
    const total = Math.max(aisMetrics.records, 1);
    const coordinateQuality = aisMetrics.coordinates / total * 100;
    const speedQuality = aisMetrics.speeds / total * 100;
    const timestampQuality = aisMetrics.timestamps / total * 100;
    const vesselDiversity = clamp(aisMetrics.vessels / total * 300, 0, 100);
    const typeDiversity = clamp(aisMetrics.types * 2, 0, 100);
    const base = coordinateQuality * .30 + speedQuality * .25 + timestampQuality * .25 + vesselDiversity * .10 + typeDiversity * .10;
    const health = clamp(Math.round(base), 45, 98);
    const pulse = [
      clamp(Math.round(base + 5), 40, 99),
      clamp(Math.round(base - 2), 35, 98),
      clamp(Math.round(base - 8), 30, 96),
      clamp(Math.round(base + 7), 45, 99)
    ];
    const cityBase = clamp(Math.round(100 - base), 20, 90);
    const cityOffsets = [18, 9, 4, -5, -10];
    const cityNames = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"];
    const cityRisk = cityNames.map((city, i) => {
      const score = clamp(cityBase + cityOffsets[i], 20, 95);
      return { city, score, status: score >= 80 ? "Critical" : score >= 65 ? "High" : score >= 45 ? "Moderate" : "Low" };
    });
    const departmentNames = ["Urban Infrastructure", "Water & Sanitation", "Transport", "Environment", "Public Services"];
    const deptOffsets = [8, 2, -4, -9, 5];
    const departments = departmentNames.map((name, i) => {
      const score = clamp(health + deptOffsets[i], 40, 99);
      const trend = `${i % 2 ? "+" : "+"}${(1.4 + ((aisMetrics.types + i * 7) % 52) / 10).toFixed(1)}%`;
      return { name, score, trend };
    });
    const projectNames = [
      ["Metro Expansion Program", "Transport"], ["Urban Water Network", "Water"],
      ["Smart Drainage Initiative", "Infrastructure"], ["Integrated Waste Program", "Environment"]
    ];
    const projectProgress = [
      clamp(health - 4, 25, 96), clamp(health - 16, 20, 92),
      clamp(health - 28, 15, 88), clamp(health - 36, 10, 82)
    ];
    const projects = projectNames.map(([name, department], i) => ({
      name, department, progress: projectProgress[i],
      status: projectProgress[i] >= 65 ? "On Track" : projectProgress[i] >= 45 ? "Attention" : "Delayed"
    }));
    const allocation = Math.max(1000, Math.round(30000 + aisMetrics.records / 2));
    const utilization = clamp(Math.round(health * .86), 35, 95);
    return { health, pulse, cityRisk, departments, projects, utilization, allocation };
  }, [aisMetrics]);

  const cityRisk = derived.cityRisk;
  const departments = derived.departments;
  const projects = derived.projects;
  const stateHealth = derived.health;
  const pulseValues = derived.pulse;
  const capitalUtilization = derived.utilization;
  const annualAllocation = derived.allocation;

  const actions = [
    { title: "Review Pune Water Network", priority: "High", owner: "Water Department", time: "AIS-linked" },
    { title: "Approve Nashik Mobility Plan", priority: "Medium", owner: "Urban Development", time: "AIS-linked" },
    { title: "Resolve Nagpur Waste Escalation", priority: "High", owner: "Environment", time: "AIS-linked" },
    { title: "Review Thane Infrastructure Report", priority: "Low", owner: "Infrastructure", time: "AIS-linked" },
  ];

  const sortedDepartments = departments
    .slice()
    .sort((a, b) => b.score - a.score);

  return (
    <div className="executive-overview">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="executive-header">

        <div>
          <div className="executive-eyebrow">
            EXECUTIVE COMMAND CENTER
          </div>

          <h1>Principal Secretary Dashboard</h1>

          <p>
            Statewide operational intelligence and strategic performance
          </p>
        </div>

        {/* <div className="header-status">

          <div className="live-dot"></div>

          <div>
            <span>System Status</span>
            <strong>LIVE</strong>
          </div>

          <div className="header-divider"></div>

          <div>
            <span>Last Updated</span>
            <strong>11:42 AM</strong>
          </div>

        </div> */}

      </div>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div className="executive-kpis">

        <div className="exec-card primary-card">

          <div className="exec-card-top">
            <span>STATE HEALTH INDEX</span>
            <span className="exec-icon">◈</span>
          </div>

          <div className="big-number">
            {stateHealth}
          </div>

          <div className="exec-card-bottom">
            <span className="positive">
              ▲ {Math.max(1, Math.round(stateHealth / 18))}.1%
            </span>

            <span>
              vs last month
            </span>
          </div>

        </div>


        <div className="exec-card">

          <div className="exec-card-top">
            <span>ACTIVE CITIES</span>
            <span className="exec-icon">◉</span>
          </div>

          <div className="big-number">
            398
          </div>

          <div className="exec-card-bottom">
            <span className="positive">
              391
            </span>

            <span>
              operational
            </span>
          </div>

        </div>


        <div className="exec-card">

          <div className="exec-card-top">
            <span>ACTIVE PROGRAMS</span>
            <span className="exec-icon">▣</span>
          </div>

          <div className="big-number">
            1,247
          </div>

          <div className="exec-card-bottom">
            <span className="positive">
              92%
            </span>

            <span>
              progressing
            </span>
          </div>

        </div>


        <div className="exec-card">

          <div className="exec-card-top">
            <span>CAPITAL UTILIZATION</span>
            <span className="exec-icon">₹</span>
          </div>

          <div className="big-number">
            78.4%
          </div>

          <div className="exec-card-bottom">
            <span className="positive">
              +{Math.max(1, Math.round(capitalUtilization / 25))}.2%
            </span>

            <span>
              this quarter
            </span>
          </div>

        </div>

      </div>


      <section className="executive-panel ais-source-panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">AIS DATA SOURCE</span>
            <h2>Operational Telemetry Connection</h2>
          </div>
          <span className={`ais-status ais-${safeClassName(aisStatus)}`}>{aisStatus}</span>
        </div>
        <div className="ais-source-grid">
          <div><span>AIS Records</span><strong>{aisMetrics.records.toLocaleString("en-IN")}</strong></div>
          <div><span>Unique Vessels</span><strong>{aisMetrics.vessels.toLocaleString("en-IN")}</strong></div>
          <div><span>Vessel Types</span><strong>{aisMetrics.types}</strong></div>
          <div><span>Average SOG</span><strong>{aisMetrics.averageSOG.toFixed(2)}</strong></div>
        </div>
        <p className="ais-note">Dashboard indicators are derived from the AIS telemetry file. The AIS dataset is used as an operational data source and does not by itself establish city-level governance conditions.</p>
      </section>

      {/* =====================================================
          STATE PERFORMANCE + CITY RISK
      ===================================================== */}

      <div className="executive-main-grid">

        {/* STATE PERFORMANCE */}

        <section className="executive-panel">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                STRATEGIC MONITOR
              </span>

              <h2>
                State Performance Pulse
              </h2>

            </div>

            <button
              type="button"
              className="panel-action"
              onClick={() =>
                setShowPerformanceDetails(true)
              }
            >
              View Details →
            </button>

          </div>


          <div className="performance-score">

            <div className="score-circle">

              <div>

                <strong>
                  {stateHealth}
                </strong>

                <span>
                  / 100
                </span>

              </div>

            </div>


            <div className="score-info">

              <h3>
                Healthy State Performance
              </h3>

              <p>
                Overall operational performance remains above
                the quarterly benchmark.
              </p>

              <div className="score-tags">

                <span className="tag-success">
                  ABOVE TARGET
                </span>

                <span className="tag-neutral">
                  Q3 FY 2026
                </span>

              </div>

            </div>

          </div>


          <div className="pulse-bars">

            <div className="pulse-row">

              <div>
                <span>Service Delivery</span>
                <strong>{pulseValues[0]}%</strong>
              </div>

              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{ width: `${pulseValues[0]}%` }}
                ></div>

              </div>

            </div>


            <div className="pulse-row">

              <div>
                <span>Infrastructure</span>
                <strong>{pulseValues[1]}%</strong>
              </div>

              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{ width: `${pulseValues[1]}%` }}
                ></div>

              </div>

            </div>


            <div className="pulse-row">

              <div>
                <span>Financial Execution</span>
                <strong>{pulseValues[2]}%</strong>
              </div>

              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{ width: `${pulseValues[2]}%` }}
                ></div>

              </div>

            </div>


            <div className="pulse-row">

              <div>
                <span>Governance Response</span>
                <strong>{pulseValues[3]}%</strong>
              </div>

              <div className="progress-track">

                <div
                  className="progress-fill"
                  style={{ width: `${pulseValues[3]}%` }}
                ></div>

              </div>

            </div>

          </div>

        </section>


        {/* CITY RISK */}

        <section className="executive-panel">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                RISK INTELLIGENCE
              </span>

              <h2>
                City Risk Watch
              </h2>

            </div>

            {/* <span className="live-badge">
              LIVE
            </span> */}

          </div>


          <div className="city-risk-list">

            {cityRisk.map((city, index) => (

              <div
                className="city-risk-row"
                key={city.city}
              >

                <div className="city-rank">
                  0{index + 1}
                </div>


                <div className="city-name">

                  <strong>
                    {city.city}
                  </strong>

                  <span>
                    {city.status}
                  </span>

                </div>


                <div className="city-risk-bar">

                  <div className="mini-track">

                    <div
                      className={`mini-fill risk-${safeClassName(city.status)}`}
                      style={{
                        width: `${city.score}%`,
                      }}
                    ></div>

                  </div>

                </div>


                <div className="city-score">
                  {city.score}
                </div>

              </div>

            ))}

          </div>

        </section>

      </div>


      {/* =====================================================
          DEPARTMENT + FINANCE
      ===================================================== */}

      <div className="executive-main-grid">

        {/* DEPARTMENT PERFORMANCE */}

        <section className="executive-panel">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                GOVERNANCE PERFORMANCE
              </span>

              <h2>
                Department Health
              </h2>

            </div>

            <button
              type="button"
              className="panel-action"
              onClick={() =>
                setShowDepartmentCompare(true)
              }
            >
              Compare →
            </button>

          </div>


          <div className="department-list">

            {departments.map((department) => (

              <div
                className="department-row"
                key={department.name}
              >

                <div className="department-title">

                  <strong>
                    {department.name}
                  </strong>

                  <span className="department-trend">
                    {department.trend}
                  </span>

                </div>


                <div className="department-progress">

                  <div className="department-track">

                    <div
                      className="department-fill"
                      style={{
                        width: `${department.score}%`,
                      }}
                    ></div>

                  </div>

                  <strong>
                    {department.score}%
                  </strong>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* FINANCE */}

        <section className="executive-panel">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                FINANCIAL CONTROL
              </span>

              <h2>
                Budget Position
              </h2>

            </div>

          </div>


          <div className="finance-total">

            <span>
              Annual Allocation
            </span>

            <strong>
              {annualAllocation.toLocaleString("en-IN")} Cr
            </strong>

          </div>


          <div className="finance-grid">

            <div className="finance-item">

              <span>
                Committed
              </span>

              <strong>
                {Math.round(annualAllocation * 0.653).toLocaleString("en-IN")} Cr
              </strong>

              <small>
                65.3%
              </small>

            </div>


            <div className="finance-item">

              <span>
                Utilized
              </span>

              <strong>
                {Math.round(annualAllocation * capitalUtilization / 100).toLocaleString("en-IN")} Cr
              </strong>

              <small>
                {capitalUtilization}%
              </small>

            </div>


            <div className="finance-item">

              <span>
                Available
              </span>

              <strong>
                {Math.round(annualAllocation * (1 - capitalUtilization / 100)).toLocaleString("en-IN")} Cr
              </strong>

              <small>
                {100 - capitalUtilization}%
              </small>

            </div>


            <div className="finance-item">

              <span>
                Forecast
              </span>

              <strong>
                {Math.round(annualAllocation * 0.941).toLocaleString("en-IN")} Cr
              </strong>

              <small>
                94.1%
              </small>

            </div>

          </div>


          <div className="budget-progress">

            <div className="budget-progress-header">

              <span>
                Utilization
              </span>

              <strong>
                {capitalUtilization}%
              </strong>

            </div>

            <div className="budget-track">

              <div
                className="budget-fill"
                style={{
                  width: `${capitalUtilization}%`,
                }}
              ></div>

            </div>

          </div>

        </section>

      </div>


      {/* =====================================================
          PROJECT PIPELINE
      ===================================================== */}

      <section className="executive-panel project-panel">

        <div className="panel-header">

          <div>

            <span className="panel-label">
              PROGRAM MANAGEMENT
            </span>

            <h2>
              Priority Project Pipeline
            </h2>

          </div>

          <button
            type="button"
            className="panel-action"
            onClick={() => setShowPortfolio(true)}
          >
            Open Portfolio →
          </button>

        </div>


        <div className="project-table">

          <div className="project-table-head">

            <span>
              PROJECT
            </span>

            <span>
              DEPARTMENT
            </span>

            <span>
              PROGRESS
            </span>

            <span>
              STATUS
            </span>

          </div>


          {projects.map((project) => (

            <div
              className="project-table-row"
              key={project.name}
            >

              <div className="project-name">

                <strong>
                  {project.name}
                </strong>

              </div>


              <div className="project-department">
                {project.department}
              </div>


              <div className="project-progress">

                <div className="project-track">

                  <div
                    className="project-fill"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  ></div>

                </div>

                <strong>
                  {project.progress}%
                </strong>

              </div>


              <div>

                <span
                  className={`project-status status-${safeClassName(project.status)}`}
                >
                  {project.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          ACTION CENTER
      ===================================================== */}

      <div className="executive-main-grid action-grid">

        {/* PRIORITY ACTIONS */}

        <section className="executive-panel">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                DECISION SUPPORT
              </span>

              <h2>
                Priority Actions
              </h2>

            </div>

            {/* <span className="action-count">
              04 OPEN
            </span> */}

          </div>


          <div className="action-list">

            {actions.map((action) => (

              <div
                className="action-row"
                key={action.title}
              >

                <div className="action-indicator"></div>


                <div className="action-content">

                  <strong>
                    {action.title}
                  </strong>

                  <span>
                    {action.owner} • {action.time}
                  </span>

                </div>


                <span
                  className={`priority-${safeClassName(action.priority)}`}
                >
                  {action.priority}
                </span>

              </div>

            ))}

          </div>

        </section>


        {/* EXECUTIVE INSIGHT */}

        <section className="executive-panel">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                SYSTEM INTELLIGENCE
              </span>

              <h2>
                Executive Insight
              </h2>

            </div>

            <span className="insight-icon">
              ✦
            </span>

          </div>


          <div className="insight-content">

            <div className="insight-number">
              12%
            </div>

            <div>

              <span className="insight-label">
                Operational Entropy
              </span>

              <p>
                System stability remains within the preferred
                operating range. Current intelligence indicates
                improving service delivery across major urban
                regions.
              </p>

            </div>

          </div>


          <div className="insight-footer">

            <div>

              <span>
                Confidence
              </span>

              <strong>
                92%
              </strong>

            </div>


            <div>

              <span>
                Data Freshness
              </span>

              <strong>
                98.7%
              </strong>

            </div>


            <div>

              <span>
                Signals
              </span>

              <strong>
                1,842
              </strong>

            </div>

          </div>

        </section>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="executive-footer">

        <span>
          UCCIS • Unified Civic Command Intelligence System
        </span>

        <span>
          Principal Secretary Control Layer
        </span>

        <span>
          Intelligence Engine v4.2
        </span>

      </div>


      {/* =====================================================
          VIEW DETAILS MODAL
      ===================================================== */}

      {showPerformanceDetails && (

        <div
          className="performance-modal-overlay"
          onClick={() =>
            setShowPerformanceDetails(false)
          }
        >

          <div
            className="performance-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="performance-modal-header">

              <div>

                <span className="panel-label">
                  STRATEGIC PERFORMANCE
                </span>

                <h2>
                  State Performance Details
                </h2>

                <p>
                  Detailed operational performance across
                  major governance indicators.
                </p>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setShowPerformanceDetails(false)
                }
              >
                ×
              </button>

            </div>


            <div className="modal-overview">

              <div className="modal-score">

                <span>
                  OVERALL SCORE
                </span>

                <strong>
                  {stateHealth}
                </strong>

                <small>
                  ▲ {Math.max(1, Math.round(stateHealth / 18))}.1% from previous period
                </small>

              </div>


              <div className="modal-status">

                <div className="modal-status-dot"></div>

                <div>

                  <strong>
                    Healthy Performance
                  </strong>

                  <span>
                    State performance is currently above
                    the quarterly benchmark.
                  </span>

                </div>

              </div>

            </div>


            <div className="modal-section-title">
              PERFORMANCE BREAKDOWN
            </div>


            <div className="detail-metrics">

              <div className="detail-metric">

                <div className="detail-metric-top">

                  <span>
                    Service Delivery
                  </span>

                  <strong>
                    {pulseValues[0]}%
                  </strong>

                </div>

                <div className="detail-track">

                  <div
                    className="detail-fill"
                    style={{
                      width: `${pulseValues[0]}%`,
                    }}
                  ></div>

                </div>

                <small>
                  Excellent
                </small>

              </div>


              <div className="detail-metric">

                <div className="detail-metric-top">

                  <span>
                    Infrastructure
                  </span>

                  <strong>
                    {pulseValues[1]}%
                  </strong>

                </div>

                <div className="detail-track">

                  <div
                    className="detail-fill"
                    style={{
                      width: `${pulseValues[1]}%`,
                    }}
                  ></div>

                </div>

                <small>
                  Strong
                </small>

              </div>


              <div className="detail-metric">

                <div className="detail-metric-top">

                  <span>
                    Financial Execution
                  </span>

                  <strong>
                    {pulseValues[2]}%
                  </strong>

                </div>

                <div className="detail-track">

                  <div
                    className="detail-fill"
                    style={{
                      width: `${pulseValues[2]}%`,
                    }}
                  ></div>

                </div>

                <small>
                  On Track
                </small>

              </div>


              <div className="detail-metric">

                <div className="detail-metric-top">

                  <span>
                    Governance Response
                  </span>

                  <strong>
                    {pulseValues[3]}%
                  </strong>

                </div>

                <div className="detail-track">

                  <div
                    className="detail-fill"
                    style={{
                      width: `${pulseValues[3]}%`,
                    }}
                  ></div>

                </div>

                <small>
                  Excellent
                </small>

              </div>

            </div>


            <div className="modal-section-title">
              KEY INSIGHTS
            </div>


            <div className="modal-insights">

              <div className="modal-insight-card">

                <span className="modal-insight-icon">
                  ↑
                </span>

                <div>

                  <strong>
                    Service delivery improving
                  </strong>

                  <p>
                    Citizen-facing service performance has
                    improved by 6.2% during the current quarter.
                  </p>

                </div>

              </div>


              <div className="modal-insight-card">

                <span className="modal-insight-icon">
                  ₹
                </span>

                <div>

                  <strong>
                    Financial execution stable
                  </strong>

                  <p>
                    Budget utilization remains within the
                    approved quarterly execution range.
                  </p>

                </div>

              </div>


              <div className="modal-insight-card">

                <span className="modal-insight-icon">
                  ◆
                </span>

                <div>

                  <strong>
                    Governance response strong
                  </strong>

                  <p>
                    Decision and escalation response times are
                    currently above the target threshold.
                  </p>

                </div>

              </div>

            </div>


            <div className="performance-modal-footer">

              <span>
                Data updated 11:42 AM
              </span>

              <button
                type="button"
                onClick={() =>
                  setShowPerformanceDetails(false)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          COMPARE DEPARTMENTS MODAL
      ===================================================== */}

      {showDepartmentCompare && (

        <div
          className="department-modal-overlay"
          onClick={() =>
            setShowDepartmentCompare(false)
          }
        >

          <div
            className="department-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="department-modal-header">

              <div>

                <span className="panel-label">
                  GOVERNANCE PERFORMANCE
                </span>

                <h2>
                  Department Performance Comparison
                </h2>

                <p>
                  Comparative view of department health,
                  execution performance and quarterly trends.
                </p>

              </div>


              <button
                type="button"
                className="department-modal-close"
                onClick={() =>
                  setShowDepartmentCompare(false)
                }
              >
                ×
              </button>

            </div>


            {/* SUMMARY */}

            <div className="comparison-summary">

              <div className="comparison-summary-card">

                <span>
                  TOP PERFORMER
                </span>

                <strong>
                  Urban Infrastructure
                </strong>

                <small>
                  91% Performance
                </small>

              </div>


              <div className="comparison-summary-card">

                <span>
                  STATE AVERAGE
                </span>

                <strong>
                  82.8%
                </strong>

                <small>
                  Across 5 departments
                </small>

              </div>


              <div className="comparison-summary-card">

                <span>
                  STRONGEST TREND
                </span>

                <strong>
                  Urban Infrastructure
                </strong>

                <small>
                  ▲ 6.4% improvement
                </small>

              </div>

            </div>


            {/* RANKING */}

            <div className="comparison-title">
              DEPARTMENT RANKING
            </div>


            <div className="comparison-list">

              {sortedDepartments.map(
                (department, index) => {

                  let performance = "Good";

                  if (department.score >= 90) {
                    performance = "Excellent";
                  } else if (department.score >= 80) {
                    performance = "Strong";
                  } else if (department.score < 75) {
                    performance = "Needs Attention";
                  }

                  return (

                    <div
                      className="comparison-row"
                      key={department.name}
                    >

                      <div className="comparison-rank">
                        {String(index + 1).padStart(2, "0")}
                      </div>


                      <div className="comparison-department">

                        <strong>
                          {department.name}
                        </strong>

                        <span>
                          Governance Department
                        </span>

                      </div>


                      <div className="comparison-score">

                        <strong>
                          {department.score}%
                        </strong>

                      </div>


                      <div className="comparison-bar-container">

                        <div className="comparison-bar">

                          <div
                            className="comparison-bar-fill"
                            style={{
                              width: `${department.score}%`,
                            }}
                          ></div>

                        </div>

                      </div>


                      <div className="comparison-trend">

                        <strong>
                          {department.trend}
                        </strong>

                        <span>
                          Quarterly
                        </span>

                      </div>


                      <div>

                        <span
                          className={`comparison-status ${safeClassName(performance)}`}
                        >
                          {performance}
                        </span>

                      </div>

                    </div>

                  );
                }
              )}

            </div>


            {/* INSIGHT */}

            <div className="comparison-insight">

              <div className="comparison-insight-icon">
                ✦
              </div>

              <div>

                <strong>
                  Executive Observation
                </strong>

                <p>
                  Urban Infrastructure currently leads the
                  department performance index. Environment
                  requires closer monitoring due to its lower
                  score despite positive quarterly movement.
                </p>

              </div>

            </div>


            {/* FOOTER */}

            <div className="department-modal-footer">

              <span>
                Comparison period: Q3 FY 2026
              </span>

              <button
                type="button"
                onClick={() =>
                  setShowDepartmentCompare(false)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          PROJECT PORTFOLIO MODAL
      ===================================================== */}

      {showPortfolio && (

        <div
          className="portfolio-modal-overlay"
          onClick={() => setShowPortfolio(false)}
        >

          <div
            className="portfolio-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}

            <div className="portfolio-modal-header">

              <div>

                <span className="panel-label">
                  PROGRAM MANAGEMENT
                </span>

                <h2>
                  Project Portfolio
                </h2>

                <p>
                  Executive view of priority programs, delivery
                  progress and current implementation status.
                </p>

              </div>

              <button
                type="button"
                className="portfolio-modal-close"
                onClick={() => setShowPortfolio(false)}
              >
                ×
              </button>

            </div>


            {/* SUMMARY CARDS */}

            <div className="portfolio-summary">

              <div className="portfolio-summary-card">
                <span>ACTIVE PROJECTS</span>
                <strong>{projects.length}</strong>
                <small>Priority programs</small>
              </div>

              <div className="portfolio-summary-card">
                <span>AVERAGE PROGRESS</span>
                <strong>
                  {Math.round(
                    projects.reduce(
                      (sum, project) => sum + project.progress,
                      0
                    ) / projects.length
                  )}%
                </strong>
                <small>Across all projects</small>
              </div>

              <div className="portfolio-summary-card">
                <span>ON TRACK</span>
                <strong>
                  {projects.filter(
                    (project) => project.status === "On Track"
                  ).length}
                </strong>
                <small>Projects progressing normally</small>
              </div>

              <div className="portfolio-summary-card">
                <span>REQUIRES ATTENTION</span>
                <strong>
                  {projects.filter(
                    (project) =>
                      project.status === "Attention" ||
                      project.status === "Delayed"
                  ).length}
                </strong>
                <small>Projects requiring review</small>
              </div>

            </div>


            {/* PORTFOLIO LIST */}

            <div className="portfolio-section-title">
              PRIORITY PROJECT PORTFOLIO
            </div>

            <div className="portfolio-list">

              {projects.map((project, index) => (

                <div
                  className="portfolio-project"
                  key={project.name}
                >

                  <div className="portfolio-project-top">

                    <div className="portfolio-project-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="portfolio-project-info">

                      <strong>
                        {project.name}
                      </strong>

                      <span>
                        {project.department} Department
                      </span>

                    </div>

                    <div className="portfolio-project-status">

                      <span
                        className={`project-status status-${safeClassName(project.status)}`}
                      >
                        {project.status}
                      </span>

                    </div>

                  </div>


                  <div className="portfolio-project-bottom">

                    <div className="portfolio-progress-area">

                      <div className="portfolio-progress-label">

                        <span>
                          Implementation Progress
                        </span>

                        <strong>
                          {project.progress}%
                        </strong>

                      </div>

                      <div className="portfolio-progress-track">

                        <div
                          className="portfolio-progress-fill"
                          style={{
                            width: `${project.progress}%`,
                          }}
                        ></div>

                      </div>

                    </div>


                    <div className="portfolio-project-meta">

                      <div>
                        <span>Department</span>
                        <strong>{project.department}</strong>
                      </div>

                      <div>
                        <span>Progress</span>
                        <strong>{project.progress}%</strong>
                      </div>

                      <div>
                        <span>Status</span>
                        <strong>{project.status}</strong>
                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>


            {/* EXECUTIVE NOTE */}

            <div className="portfolio-note">

              <div className="portfolio-note-icon">
                ✦
              </div>

              <div>

                <strong>
                  Portfolio Intelligence
                </strong>

                <p>
                  The Metro Expansion Program currently has the
                  highest implementation progress. The Integrated
                  Waste Program requires executive attention because
                  its current progress is below the other priority
                  programs.
                </p>

              </div>

            </div>


            {/* FOOTER */}

            <div className="portfolio-modal-footer">

              <span>
                Portfolio period: Q3 FY 2026
              </span>

              <button
                type="button"
                onClick={() => setShowPortfolio(false)}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .executive-overview {
          min-height: 100vh;
          padding: 28px 32px 40px;

          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(56, 189, 248, 0.08),
              transparent 28%
            ),
            #07111f;

          color: #e8f1f8;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }


        /* HEADER */

        .executive-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-bottom: 28px;
        }

        .executive-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;

          color: #55d6ff;

          margin-bottom: 7px;
        }

        .executive-header h1 {
          margin: 0;

          font-size: 29px;
          font-weight: 700;

          letter-spacing: -0.6px;

          text-transform: uppercase;
        }

        .executive-header p {
          margin: 7px 0 0;

          color: #8295a9;

          font-size: 13px;
        }

        .header-status {
          display: flex;
          align-items: center;
          gap: 12px;

          padding: 11px 16px;

          border:
            1px solid
            rgba(120, 160, 190, 0.15);

          border-radius: 10px;

          background:
            rgba(10, 24, 40, 0.75);
        }

        .live-dot {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          background: #39e58c;

          box-shadow:
            0 0 12px
            rgba(57, 229, 140, 0.8);
        }

        .header-status div:not(.live-dot) {
          display: flex;
          flex-direction: column;
        }

        .header-status span {
          font-size: 9px;

          color: #71869b;

          text-transform: uppercase;

          letter-spacing: 0.8px;
        }

        .header-status strong {
          font-size: 11px;

          margin-top: 2px;
        }

        .header-divider {
          width: 1px;
          height: 30px;

          background:
            rgba(255,255,255,0.1);
        }


        /* KPI */

        .executive-kpis {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 14px;

          margin-bottom: 16px;
        }

        .exec-card {
          padding: 18px;

          min-height: 132px;

          border:
            1px solid
            rgba(130, 160, 190, 0.14);

          border-radius: 12px;

          background:
            linear-gradient(
              145deg,
              rgba(17, 35, 54, 0.96),
              rgba(8, 21, 36, 0.96)
            );

          box-shadow:
            0 12px 30px
            rgba(0,0,0,0.18);
        }

        .primary-card {
          border-color:
            rgba(65, 210, 255, 0.28);
        }

        .exec-card-top {
          display: flex;

          justify-content: space-between;
          align-items: center;

          color: #7890a5;

          font-size: 9px;
          font-weight: 700;

          letter-spacing: 1.2px;
        }

        .exec-icon {
          color: #51d5ff;

          font-size: 16px;
        }

        .big-number {
          margin-top: 13px;

          font-size: 31px;
          font-weight: 700;

          letter-spacing: -1px;
        }

        .exec-card-bottom {
          display: flex;

          gap: 7px;

          align-items: center;

          margin-top: 7px;

          font-size: 10px;

          color: #71869a;
        }

        .positive {
          color: #40dc91;

          font-weight: 700;
        }


        /* MAIN GRID */

        .executive-main-grid {
          display: grid;

          grid-template-columns:
            1.25fr 1fr;

          gap: 16px;

          margin-bottom: 16px;
        }


        /* PANEL */

        .executive-panel {
          border:
            1px solid
            rgba(130, 160, 190, 0.14);

          border-radius: 12px;

          background:
            linear-gradient(
              145deg,
              rgba(14, 30, 47, 0.96),
              rgba(7, 18, 31, 0.98)
            );

          padding: 20px;

          box-shadow:
            0 14px 35px
            rgba(0,0,0,0.17);
        }

        .panel-header {
          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          margin-bottom: 20px;
        }

        .panel-label {
          display: block;

          color: #4fcff7;

          font-size: 9px;
          font-weight: 700;

          letter-spacing: 1.5px;

          margin-bottom: 6px;
        }

        .panel-header h2 {
          margin: 0;

          font-size: 17px;
          font-weight: 650;
        }

        .panel-action {
          border: 0;

          background: transparent;

          color: #6bdcff;

          font-size: 10px;
          font-weight: 600;

          cursor: pointer;

          transition: 0.2s;
        }

        .panel-action:hover {
          color: #ffffff;

          transform: translateX(2px);
        }

        .live-badge {
          padding: 5px 8px;

          border-radius: 5px;

          background:
            rgba(50, 220, 139, 0.1);

          color: #4de497;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 1px;
        }


        /* PERFORMANCE */

        .performance-score {
          display: flex;

          align-items: center;

          gap: 24px;

          margin-bottom: 25px;
        }

        .score-circle {
          width: 112px;
          height: 112px;

          flex-shrink: 0;

          border-radius: 50%;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            conic-gradient(
              #46d7ff 0deg,
              #46d7ff 315deg,
              rgba(255,255,255,0.08) 315deg
            );

          position: relative;
        }

        .score-circle::after {
          content: "";

          position: absolute;

          width: 88px;
          height: 88px;

          border-radius: 50%;

          background: #0b1b2d;
        }

        .score-circle > div {
          position: relative;

          z-index: 1;

          text-align: center;
        }

        .score-circle strong {
          display: block;

          font-size: 24px;
        }

        .score-circle span {
          font-size: 8px;

          color: #71869b;
        }

        .score-info h3 {
          margin: 0 0 7px;

          font-size: 15px;
        }

        .score-info p {
          margin: 0;

          max-width: 380px;

          color: #8094a8;

          line-height: 1.6;

          font-size: 11px;
        }

        .score-tags {
          display: flex;

          gap: 7px;

          margin-top: 11px;
        }

        .score-tags span {
          padding: 5px 7px;

          border-radius: 4px;

          font-size: 8px;
          font-weight: 700;
        }

        .tag-success {
          background:
            rgba(61, 223, 145, 0.1);

          color: #48df94;
        }

        .tag-neutral {
          background:
            rgba(130, 150, 170, 0.1);

          color: #8193a7;
        }


        /* PULSE */

        .pulse-row {
          margin-bottom: 15px;
        }

        .pulse-row > div:first-child {
          display: flex;

          justify-content: space-between;

          margin-bottom: 6px;
        }

        .pulse-row span {
          font-size: 10px;

          color: #8da0b2;
        }

        .pulse-row strong {
          font-size: 10px;
        }

        .progress-track,
        .department-track,
        .project-track,
        .budget-track {
          height: 5px;

          background:
            rgba(255,255,255,0.07);

          border-radius: 10px;

          overflow: hidden;
        }

        .progress-fill,
        .department-fill,
        .project-fill,
        .budget-fill {
          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              #32bfe9,
              #55e0ff
            );
        }


        /* CITY RISK */

        .city-risk-list {
          display: flex;

          flex-direction: column;
        }

        .city-risk-row {
          display: grid;

          grid-template-columns:
            28px 110px 1fr 35px;

          align-items: center;

          gap: 10px;

          padding: 12px 0;

          border-bottom:
            1px solid
            rgba(255,255,255,0.05);
        }

        .city-risk-row:last-child {
          border-bottom: 0;
        }

        .city-rank {
          color: #536b80;

          font-size: 9px;

          font-weight: 700;
        }

        .city-name strong {
          display: block;

          font-size: 11px;
        }

        .city-name span {
          display: block;

          margin-top: 3px;

          color: #6d8195;

          font-size: 8px;
        }

        .mini-track {
          height: 4px;

          background:
            rgba(255,255,255,0.06);

          border-radius: 5px;
        }

        .mini-fill {
          height: 100%;

          border-radius: 5px;

          background: #42d9ff;
        }

        .risk-critical {
          background: #ff5d73;
        }

        .risk-high {
          background: #ffad4c;
        }

        .risk-moderate {
          background: #48d9a0;
        }

        .city-score {
          text-align: right;

          font-size: 11px;

          font-weight: 700;
        }


        /* DEPARTMENT */

        .department-row {
          padding: 11px 0;

          border-bottom:
            1px solid
            rgba(255,255,255,0.05);
        }

        .department-row:last-child {
          border-bottom: 0;
        }

        .department-title {
          display: flex;

          justify-content: space-between;

          margin-bottom: 7px;
        }

        .department-title strong {
          font-size: 10px;
        }

        .department-trend {
          color: #46dd91;

          font-size: 9px;

          font-weight: 700;
        }

        .department-progress {
          display: grid;

          grid-template-columns:
            1fr 35px;

          gap: 10px;

          align-items: center;
        }

        .department-progress > strong {
          font-size: 10px;

          text-align: right;
        }


        /* FINANCE */

        .finance-total {
          padding: 15px;

          border-radius: 9px;

          background:
            rgba(54, 206, 244, 0.05);

          border:
            1px solid
            rgba(70, 210, 245, 0.1);
        }

        .finance-total span {
          display: block;

          color: #71879b;

          font-size: 9px;

          text-transform: uppercase;

          letter-spacing: 1px;
        }

        .finance-total strong {
          display: block;

          margin-top: 6px;

          font-size: 25px;
        }

        .finance-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 10px;

          margin-top: 12px;
        }

        .finance-item {
          padding: 10px;

          border:
            1px solid
            rgba(255,255,255,0.06);

          border-radius: 7px;
        }

        .finance-item span,
        .finance-item small {
          display: block;

          color: #6f8498;

          font-size: 8px;
        }

        .finance-item strong {
          display: block;

          margin: 4px 0;

          font-size: 12px;
        }

        .finance-item small {
          color: #43dc92;
        }

        .budget-progress {
          margin-top: 15px;
        }

        .budget-progress-header {
          display: flex;

          justify-content: space-between;

          margin-bottom: 7px;

          font-size: 9px;

          color: #8296a8;
        }


        /* PROJECT */

        .project-panel {
          margin-bottom: 16px;
        }

        .project-table-head,
        .project-table-row {
          display: grid;

          grid-template-columns:
            2fr 1fr 1.4fr 0.7fr;

          gap: 15px;

          align-items: center;
        }

        .project-table-head {
          padding: 0 0 10px;

          color: #5e7489;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 1px;
        }

        .project-table-row {
          padding: 14px 0;

          border-top:
            1px solid
            rgba(255,255,255,0.05);
        }

        .project-name strong {
          font-size: 11px;
        }

        .project-department {
          color: #8094a7;

          font-size: 10px;
        }

        .project-progress {
          display: grid;

          grid-template-columns:
            1fr 30px;

          gap: 8px;

          align-items: center;
        }

        .project-progress strong {
          font-size: 9px;

          text-align: right;
        }

        .project-status {
          display: inline-block;

          padding: 5px 7px;

          border-radius: 4px;

          font-size: 7px;

          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: 0.5px;
        }

        .status-on-track {
          color: #43df92;

          background:
            rgba(67, 223, 146, 0.1);
        }

        .status-attention {
          color: #ffc15c;

          background:
            rgba(255, 193, 92, 0.1);
        }

        .status-delayed {
          color: #ff7181;

          background:
            rgba(255, 113, 129, 0.1);
        }


        /* ACTIONS */

        .action-grid {
          grid-template-columns:
            1fr 1fr;
        }

        .action-count {
          color: #ffbd55;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 1px;
        }

        .action-row {
          display: flex;

          align-items: center;

          gap: 11px;

          padding: 13px 0;

          border-bottom:
            1px solid
            rgba(255,255,255,0.05);
        }

        .action-row:last-child {
          border-bottom: 0;
        }

        .action-indicator {
          width: 5px;
          height: 32px;

          border-radius: 5px;

          background: #35c8ed;
        }

        .action-content {
          flex: 1;
        }

        .action-content strong {
          display: block;

          font-size: 10px;
        }

        .action-content span {
          display: block;

          margin-top: 4px;

          color: #6f8397;

          font-size: 8px;
        }

        .priority-high,
        .priority-medium,
        .priority-low {
          font-size: 8px;

          font-weight: 800;

          text-transform: uppercase;
        }

        .priority-high {
          color: #ff6576;
        }

        .priority-medium {
          color: #ffbd57;
        }

        .priority-low {
          color: #4bdc99;
        }


        /* INSIGHT */

        .insight-icon {
          color: #55dfff;

          font-size: 18px;
        }

        .insight-content {
          display: flex;

          align-items: center;

          gap: 18px;

          padding: 15px;

          border-radius: 9px;

          background:
            linear-gradient(
              120deg,
              rgba(60, 203, 242, 0.08),
              rgba(60, 203, 242, 0.02)
            );

          border:
            1px solid
            rgba(60, 203, 242, 0.1);
        }

        .insight-number {
          font-size: 36px;

          font-weight: 700;

          color: #55dfff;
        }

        .insight-label {
          font-size: 10px;

          font-weight: 700;
        }

        .insight-content p {
          margin: 5px 0 0;

          color: #71879b;

          line-height: 1.55;

          font-size: 9px;
        }

        .insight-footer {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          margin-top: 15px;
        }

        .insight-footer div {
          padding: 8px 12px;

          border-left:
            1px solid
            rgba(255,255,255,0.07);
        }

        .insight-footer div:first-child {
          border-left: 0;

          padding-left: 0;
        }

        .insight-footer span {
          display: block;

          color: #647a8e;

          font-size: 8px;
        }

        .insight-footer strong {
          display: block;

          margin-top: 4px;

          font-size: 13px;
        }


        /* FOOTER */

        .executive-footer {
          display: flex;

          justify-content: space-between;

          padding: 18px 3px 0;

          color: #506579;

          font-size: 8px;

          letter-spacing: 0.4px;
        }


        /* =====================================================
           VIEW DETAILS MODAL
        ===================================================== */

        .performance-modal-overlay {
          position: fixed;

          inset: 0;

          z-index: 9999;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 25px;

          background:
            rgba(2, 8, 18, 0.78);

          backdrop-filter: blur(7px);
        }

        .performance-modal {
          width: min(760px, 95vw);

          max-height: 90vh;

          overflow-y: auto;

          border:
            1px solid
            rgba(80, 210, 255, 0.2);

          border-radius: 14px;

          background:
            linear-gradient(
              145deg,
              #102438,
              #071522
            );

          box-shadow:
            0 30px 80px
            rgba(0, 0, 0, 0.55);

          padding: 25px;
        }

        .performance-modal-header {
          display: flex;

          justify-content: space-between;

          align-items: flex-start;

          padding-bottom: 20px;

          border-bottom:
            1px solid
            rgba(255,255,255,0.07);
        }

        .performance-modal-header h2 {
          margin: 0;

          font-size: 21px;

          font-weight: 700;
        }

        .performance-modal-header p {
          margin: 7px 0 0;

          color: #7e94a8;

          font-size: 11px;
        }

        .modal-close {
          width: 32px;
          height: 32px;

          border:
            1px solid
            rgba(255,255,255,0.08);

          border-radius: 7px;

          background:
            rgba(255,255,255,0.04);

          color: #91a5b7;

          font-size: 22px;

          cursor: pointer;
        }

        .modal-close:hover {
          background:
            rgba(255,255,255,0.09);

          color: white;
        }

        .modal-overview {
          display: grid;

          grid-template-columns:
            180px 1fr;

          gap: 20px;

          margin-top: 20px;
        }

        .modal-score {
          padding: 17px;

          border-radius: 10px;

          background:
            rgba(57, 205, 243, 0.06);

          border:
            1px solid
            rgba(57, 205, 243, 0.12);
        }

        .modal-score span {
          display: block;

          color: #6e8498;

          font-size: 8px;

          letter-spacing: 1.2px;

          font-weight: 700;
        }

        .modal-score strong {
          display: block;

          margin-top: 5px;

          color: #55dcff;

          font-size: 31px;
        }

        .modal-score small {
          display: block;

          margin-top: 4px;

          color: #43dc91;

          font-size: 8px;
        }

        .modal-status {
          display: flex;

          align-items: center;

          gap: 12px;

          padding: 15px;

          border-radius: 10px;

          background:
            rgba(65, 220, 145, 0.05);

          border:
            1px solid
            rgba(65, 220, 145, 0.1);
        }

        .modal-status-dot {
          width: 10px;
          height: 10px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #43df92;

          box-shadow:
            0 0 12px
            rgba(67, 223, 146, 0.7);
        }

        .modal-status strong {
          display: block;

          font-size: 12px;
        }

        .modal-status span {
          display: block;

          margin-top: 5px;

          color: #71879b;

          font-size: 9px;

          line-height: 1.5;
        }

        .modal-section-title {
          margin-top: 25px;

          margin-bottom: 12px;

          color: #4fd4fb;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 1.5px;
        }

        .detail-metrics {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 10px;
        }

        .detail-metric {
          padding: 13px;

          border-radius: 9px;

          background:
            rgba(255,255,255,0.025);

          border:
            1px solid
            rgba(255,255,255,0.06);
        }

        .detail-metric-top {
          display: flex;

          justify-content: space-between;

          margin-bottom: 8px;
        }

        .detail-metric-top span {
          color: #9aabba;

          font-size: 9px;
        }

        .detail-metric-top strong {
          font-size: 10px;

          color: #e6f3fa;
        }

        .detail-track {
          height: 5px;

          border-radius: 5px;

          overflow: hidden;

          background:
            rgba(255,255,255,0.07);
        }

        .detail-fill {
          height: 100%;

          border-radius: 5px;

          background:
            linear-gradient(
              90deg,
              #32bfe9,
              #55e0ff
            );
        }

        .detail-metric small {
          display: block;

          margin-top: 7px;

          color: #49dc96;

          font-size: 8px;
        }

        .modal-insights {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 10px;
        }

        .modal-insight-card {
          display: flex;

          gap: 10px;

          padding: 13px;

          border-radius: 9px;

          background:
            rgba(255,255,255,0.025);

          border:
            1px solid
            rgba(255,255,255,0.06);
        }

        .modal-insight-icon {
          width: 25px;
          height: 25px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 6px;

          color: #51d9ff;

          background:
            rgba(51, 211, 250, 0.08);

          font-size: 12px;
        }

        .modal-insight-card strong {
          display: block;

          font-size: 9px;
        }

        .modal-insight-card p {
          margin: 5px 0 0;

          color: #6f8397;

          font-size: 8px;

          line-height: 1.5;
        }

        .performance-modal-footer {
          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-top: 22px;

          padding-top: 15px;

          border-top:
            1px solid
            rgba(255,255,255,0.07);
        }

        .performance-modal-footer span {
          color: #5f7488;

          font-size: 8px;
        }

        .performance-modal-footer button {
          border: 0;

          padding: 8px 15px;

          border-radius: 6px;

          background:
            rgba(62, 207, 244, 0.1);

          color: #55d9ff;

          font-size: 9px;

          font-weight: 700;

          cursor: pointer;
        }

        .performance-modal-footer button:hover {
          background:
            rgba(62, 207, 244, 0.18);
        }


        /* =====================================================
           DEPARTMENT COMPARISON MODAL
        ===================================================== */

        .department-modal-overlay {
          position: fixed;

          inset: 0;

          z-index: 10000;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 25px;

          background:
            rgba(2, 8, 18, 0.8);

          backdrop-filter: blur(8px);
        }

        .department-modal {
          width: min(900px, 95vw);

          max-height: 90vh;

          overflow-y: auto;

          padding: 26px;

          border-radius: 14px;

          border:
            1px solid
            rgba(70, 210, 250, 0.2);

          background:
            linear-gradient(
              145deg,
              #102438,
              #071522
            );

          box-shadow:
            0 30px 90px
            rgba(0, 0, 0, 0.6);
        }

        .department-modal-header {
          display: flex;

          justify-content: space-between;

          align-items: flex-start;

          padding-bottom: 20px;

          border-bottom:
            1px solid
            rgba(255,255,255,0.07);
        }

        .department-modal-header h2 {
          margin: 0;

          font-size: 21px;

          font-weight: 700;
        }

        .department-modal-header p {
          margin: 7px 0 0;

          color: #7c91a5;

          font-size: 10px;
        }

        .department-modal-close {
          width: 32px;
          height: 32px;

          border-radius: 7px;

          border:
            1px solid
            rgba(255,255,255,0.08);

          background:
            rgba(255,255,255,0.04);

          color: #91a5b7;

          font-size: 22px;

          cursor: pointer;
        }

        .department-modal-close:hover {
          background:
            rgba(255,255,255,0.1);

          color: white;
        }


        /* COMPARISON SUMMARY */

        .comparison-summary {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 10px;

          margin-top: 20px;
        }

        .comparison-summary-card {
          padding: 14px;

          border-radius: 9px;

          background:
            rgba(255,255,255,0.025);

          border:
            1px solid
            rgba(255,255,255,0.06);
        }

        .comparison-summary-card span {
          display: block;

          color: #5e778d;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 1px;
        }

        .comparison-summary-card strong {
          display: block;

          margin-top: 7px;

          font-size: 12px;

          color: #e7f4fa;
        }

        .comparison-summary-card small {
          display: block;

          margin-top: 5px;

          color: #43dc92;

          font-size: 8px;
        }


        /* COMPARISON TITLE */

        .comparison-title {
          margin-top: 25px;

          margin-bottom: 10px;

          color: #4fd4fb;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 1.5px;
        }


        /* COMPARISON LIST */

        .comparison-list {
          border:
            1px solid
            rgba(255,255,255,0.06);

          border-radius: 10px;

          overflow: hidden;
        }

        .comparison-row {
          display: grid;

          grid-template-columns:
            40px
            1.5fr
            60px
            1.4fr
            70px
            110px;

          gap: 12px;

          align-items: center;

          min-height: 65px;

          padding: 10px 14px;

          border-bottom:
            1px solid
            rgba(255,255,255,0.05);
        }

        .comparison-row:last-child {
          border-bottom: 0;
        }

        .comparison-row:hover {
          background:
            rgba(65, 210, 245, 0.035);
        }

        .comparison-rank {
          color: #506a80;

          font-size: 10px;

          font-weight: 800;
        }

        .comparison-department strong {
          display: block;

          font-size: 10px;
        }

        .comparison-department span {
          display: block;

          margin-top: 4px;

          color: #657d91;

          font-size: 8px;
        }

        .comparison-score strong {
          font-size: 14px;

          color: #55dfff;
        }

        .comparison-bar-container {
          width: 100%;
        }

        .comparison-bar {
          width: 100%;

          height: 6px;

          border-radius: 8px;

          overflow: hidden;

          background:
            rgba(255,255,255,0.07);
        }

        .comparison-bar-fill {
          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              #32bfe9,
              #55e0ff
            );
        }

        .comparison-trend strong {
          display: block;

          color: #43dc92;

          font-size: 9px;
        }

        .comparison-trend span {
          display: block;

          margin-top: 3px;

          color: #61798d;

          font-size: 7px;
        }

        .comparison-status {
          display: inline-block;

          padding: 5px 7px;

          border-radius: 4px;

          font-size: 7px;

          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: 0.3px;
        }

        .comparison-status.excellent {
          color: #43df92;

          background:
            rgba(67,223,146,0.1);
        }

        .comparison-status.strong {
          color: #55d9ff;

          background:
            rgba(85,217,255,0.1);
        }

        .comparison-status.good {
          color: #ffc15c;

          background:
            rgba(255,193,92,0.1);
        }

        .comparison-status.needs-attention {
          color: #ff7181;

          background:
            rgba(255,113,129,0.1);
        }


        /* COMPARISON INSIGHT */

        .comparison-insight {
          display: flex;

          align-items: center;

          gap: 12px;

          margin-top: 18px;

          padding: 14px;

          border-radius: 9px;

          background:
            rgba(58,205,242,0.05);

          border:
            1px solid
            rgba(58,205,242,0.1);
        }

        .comparison-insight-icon {
          width: 30px;
          height: 30px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 7px;

          color: #55dfff;

          background:
            rgba(85,217,255,0.08);
        }

        .comparison-insight strong {
          display: block;

          font-size: 10px;
        }

        .comparison-insight p {
          margin: 5px 0 0;

          color: #71879b;

          font-size: 8px;

          line-height: 1.6;
        }


        /* COMPARISON FOOTER */

        .department-modal-footer {
          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-top: 20px;

          padding-top: 15px;

          border-top:
            1px solid
            rgba(255,255,255,0.07);
        }

        .department-modal-footer span {
          color: #5f7488;

          font-size: 8px;
        }

        .department-modal-footer button {
          border: 0;

          padding: 8px 15px;

          border-radius: 6px;

          background:
            rgba(62,207,244,0.1);

          color: #55d9ff;

          font-size: 9px;

          font-weight: 700;

          cursor: pointer;
        }

        .department-modal-footer button:hover {
          background:
            rgba(62,207,244,0.2);
        }


        /* =====================================================
           PROJECT PORTFOLIO MODAL
        ===================================================== */

        .portfolio-modal-overlay {
          position: fixed;

          inset: 0;

          z-index: 10001;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 25px;

          background:
            rgba(2, 8, 18, 0.82);

          backdrop-filter: blur(8px);
        }

        .portfolio-modal {
          width: min(960px, 95vw);

          max-height: 90vh;

          overflow-y: auto;

          padding: 26px;

          border-radius: 14px;

          border:
            1px solid
            rgba(70, 210, 250, 0.2);

          background:
            linear-gradient(
              145deg,
              #102438,
              #071522
            );

          box-shadow:
            0 30px 90px
            rgba(0, 0, 0, 0.62);
        }

        .portfolio-modal-header {
          display: flex;

          justify-content: space-between;

          align-items: flex-start;

          padding-bottom: 20px;

          border-bottom:
            1px solid
            rgba(255,255,255,0.07);
        }

        .portfolio-modal-header h2 {
          margin: 0;

          font-size: 21px;

          font-weight: 700;
        }

        .portfolio-modal-header p {
          margin: 7px 0 0;

          max-width: 650px;

          color: #7c91a5;

          font-size: 10px;

          line-height: 1.5;
        }

        .portfolio-modal-close {
          width: 32px;
          height: 32px;

          flex-shrink: 0;

          border-radius: 7px;

          border:
            1px solid
            rgba(255,255,255,0.08);

          background:
            rgba(255,255,255,0.04);

          color: #91a5b7;

          font-size: 22px;

          cursor: pointer;

          transition: 0.2s;
        }

        .portfolio-modal-close:hover {
          background:
            rgba(255,255,255,0.1);

          color: white;
        }

        .portfolio-summary {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 10px;

          margin-top: 20px;
        }

        .portfolio-summary-card {
          padding: 14px;

          min-height: 92px;

          border-radius: 9px;

          background:
            rgba(255,255,255,0.025);

          border:
            1px solid
            rgba(255,255,255,0.06);
        }

        .portfolio-summary-card span {
          display: block;

          color: #60788d;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 1px;
        }

        .portfolio-summary-card strong {
          display: block;

          margin-top: 8px;

          color: #55dcff;

          font-size: 23px;

          font-weight: 700;
        }

        .portfolio-summary-card small {
          display: block;

          margin-top: 4px;

          color: #6f8497;

          font-size: 8px;
        }

        .portfolio-section-title {
          margin-top: 25px;

          margin-bottom: 11px;

          color: #4fd4fb;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 1.5px;
        }

        .portfolio-list {
          display: flex;

          flex-direction: column;

          gap: 9px;
        }

        .portfolio-project {
          padding: 14px;

          border-radius: 9px;

          background:
            rgba(255,255,255,0.025);

          border:
            1px solid
            rgba(255,255,255,0.06);

          transition:
            background 0.2s,
            border-color 0.2s,
            transform 0.2s;
        }

        .portfolio-project:hover {
          background:
            rgba(70,210,250,0.04);

          border-color:
            rgba(70,210,250,0.13);

          transform: translateY(-1px);
        }

        .portfolio-project-top {
          display: grid;

          grid-template-columns:
            38px 1fr auto;

          gap: 12px;

          align-items: center;
        }

        .portfolio-project-number {
          width: 30px;
          height: 30px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 7px;

          color: #4fcff7;

          background:
            rgba(79,207,247,0.07);

          font-size: 9px;

          font-weight: 800;
        }

        .portfolio-project-info strong {
          display: block;

          font-size: 11px;
        }

        .portfolio-project-info span {
          display: block;

          margin-top: 4px;

          color: #687f93;

          font-size: 8px;
        }

        .portfolio-project-status {
          text-align: right;
        }

        .portfolio-project-bottom {
          display: grid;

          grid-template-columns:
            1.3fr 1fr;

          gap: 20px;

          align-items: center;

          margin-top: 13px;

          padding-top: 12px;

          border-top:
            1px solid
            rgba(255,255,255,0.05);
        }

        .portfolio-progress-label {
          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-bottom: 7px;
        }

        .portfolio-progress-label span {
          color: #71879b;

          font-size: 8px;
        }

        .portfolio-progress-label strong {
          color: #dcecf5;

          font-size: 9px;
        }

        .portfolio-progress-track {
          height: 6px;

          overflow: hidden;

          border-radius: 10px;

          background:
            rgba(255,255,255,0.07);
        }

        .portfolio-progress-fill {
          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              #32bfe9,
              #55e0ff
            );
        }

        .portfolio-project-meta {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 8px;
        }

        .portfolio-project-meta div {
          padding-left: 9px;

          border-left:
            1px solid
            rgba(255,255,255,0.07);
        }

        .portfolio-project-meta div:first-child {
          border-left: 0;

          padding-left: 0;
        }

        .portfolio-project-meta span {
          display: block;

          color: #5f778b;

          font-size: 7px;

          text-transform: uppercase;

          letter-spacing: 0.6px;
        }

        .portfolio-project-meta strong {
          display: block;

          margin-top: 4px;

          color: #dceaf2;

          font-size: 8px;
        }

        .portfolio-note {
          display: flex;

          align-items: flex-start;

          gap: 11px;

          margin-top: 18px;

          padding: 14px;

          border-radius: 9px;

          background:
            rgba(57,205,243,0.05);

          border:
            1px solid
            rgba(57,205,243,0.1);
        }

        .portfolio-note-icon {
          width: 28px;
          height: 28px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 7px;

          color: #55dfff;

          background:
            rgba(85,217,255,0.08);

          font-size: 12px;
        }

        .portfolio-note strong {
          display: block;

          font-size: 10px;
        }

        .portfolio-note p {
          margin: 5px 0 0;

          color: #71879b;

          font-size: 8px;

          line-height: 1.6;
        }

        .portfolio-modal-footer {
          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-top: 20px;

          padding-top: 15px;

          border-top:
            1px solid
            rgba(255,255,255,0.07);
        }

        .portfolio-modal-footer span {
          color: #5f7488;

          font-size: 8px;
        }

        .portfolio-modal-footer button {
          border: 0;

          padding: 8px 15px;

          border-radius: 6px;

          background:
            rgba(62,207,244,0.1);

          color: #55d9ff;

          font-size: 9px;

          font-weight: 700;

          cursor: pointer;

          transition: 0.2s;
        }

        .portfolio-modal-footer button:hover {
          background:
            rgba(62,207,244,0.2);
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1100px) {

          .portfolio-summary {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .portfolio-project-bottom {
            grid-template-columns: 1fr;
          }

          .executive-kpis {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .executive-main-grid {
            grid-template-columns: 1fr;
          }

        }


        @media (max-width: 750px) {

          .portfolio-modal {
            padding: 18px;
          }

          .portfolio-summary {
            grid-template-columns: 1fr;
          }

          .portfolio-project-top {
            grid-template-columns:
              32px 1fr;
          }

          .portfolio-project-status {
            grid-column: 2;
            text-align: left;
          }

          .portfolio-project-meta {
            grid-template-columns: 1fr 1fr;
          }

          .portfolio-modal-footer {
            gap: 10px;
          }

          .executive-overview {
            padding: 18px;
          }

          .executive-header {
            flex-direction: column;

            align-items: flex-start;

            gap: 15px;
          }

          .header-status {
            width: 100%;
          }

          .executive-kpis {
            grid-template-columns: 1fr;
          }

          .performance-score {
            flex-direction: column;

            align-items: flex-start;
          }

          .modal-overview {
            grid-template-columns: 1fr;
          }

          .detail-metrics {
            grid-template-columns: 1fr;
          }

          .modal-insights {
            grid-template-columns: 1fr;
          }

          .comparison-summary {
            grid-template-columns: 1fr;
          }

          .comparison-list {
            overflow-x: auto;
          }

          .comparison-row {
            min-width: 750px;
          }

          .project-table {
            overflow-x: auto;
          }

          .project-table-head,
          .project-table-row {
            min-width: 700px;
          }

          .executive-footer {
            flex-direction: column;

            gap: 7px;
          }

        }

      `}</style>

    </div>
  );
}