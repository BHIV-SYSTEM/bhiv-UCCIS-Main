import React, { useEffect, useMemo, useState } from "react";

const AIS_FILE = "/AIS_file.csv";

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  const input = String(text || "").replace(/^\uFEFF/, "");

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell.trim());
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some((value) => value !== "")) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = (values[index] ?? "").trim();
    });
    return record;
  });
}

function number(value) {
  const parsed = Number.parseFloat(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateAISMetrics(records) {
  const vessels = new Set();
  const vesselTypes = new Set();
  let totalSOG = 0;
  let moving = 0;

  records.forEach((record) => {
    const mmsi = record.MMSI ?? record.mmsi;
    const vesselType = record.VesselType ?? record.vesselType ?? record.VESSEL_TYPE;
    const sog = number(record.SOG ?? record.sog);

    if (mmsi) vessels.add(String(mmsi));
    if (vesselType) vesselTypes.add(String(vesselType));
    totalSOG += sog;
    if (sog > 0) moving += 1;
  });

  const totalRecords = records.length;
  const averageSOG = totalRecords ? totalSOG / totalRecords : 0;
  const movingPercentage = totalRecords ? (moving / totalRecords) * 100 : 0;

  // Operational indicator calculated from the available AIS records.
  const activityScore = Math.min(movingPercentage, 100) * 0.7;
  const speedScore = Math.min(averageSOG / 10, 1) * 30;
  const riskScore = Number((activityScore + speedScore).toFixed(1));

  let riskLevel = "LOW";
  if (riskScore > 70) riskLevel = "HIGH";
  else if (riskScore >= 40) riskLevel = "MEDIUM";

  return {
    totalRecords,
    uniqueVessels: vessels.size,
    vesselTypes: vesselTypes.size,
    averageSOG: Number(averageSOG.toFixed(2)),
    movingPercentage: Number(movingPercentage.toFixed(1)),
    riskScore,
    riskLevel,
  };
}

const styles = `
  .ais-dashboard, .ais-dashboard * { box-sizing: border-box; }
  .ais-dashboard {
    min-height: 100vh; width: 100%; padding: 30px;
    background: #080b12; color: #f3f4f6;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .ais-main { max-width: 1600px; margin: 0 auto; }
  .ais-header { display:flex; justify-content:space-between; align-items:flex-start; gap:20px; margin-bottom:28px; }
  .ais-eyebrow { color:#60a5fa; text-transform:uppercase; letter-spacing:.15em; font-size:11px; font-weight:800; margin:0 0 10px; }
  .ais-title { margin:0; font-size:clamp(28px,4vw,44px); line-height:1.15; letter-spacing:-.04em; font-weight:800; color:#f9fafb; }
  .ais-subtitle { color:#9ca3af; margin:12px 0 0; font-size:15px; }
  .ais-source { color:#9ca3af; font-size:12px; margin-top:12px; }
  .ais-source strong { color:#e5e7eb; }
  .ais-refresh { border:1px solid #374151; border-radius:10px; padding:11px 16px; color:#f9fafb; background:#171c27; font-weight:700; cursor:pointer; }
  .ais-refresh:hover { background:#222a38; }
  .ais-refresh:disabled { opacity:.6; cursor:wait; }
  .ais-panel { background:#111722; border:1px solid #273142; border-radius:18px; padding:25px; box-shadow:0 12px 32px rgba(0,0,0,.2); margin-bottom:22px; }
  .ais-panel-heading { display:flex; align-items:center; justify-content:space-between; gap:15px; margin:0 0 20px; }
  .ais-panel h2 { color:#f3f4f6; font-size:21px; margin:0; letter-spacing:-.02em; }
  .ais-muted { color:#9ca3af; }
  .ais-alert { border-color:#7f1d1d; background:linear-gradient(135deg,#241116,#151722); }
  .ais-alert-top { display:flex; justify-content:space-between; align-items:center; gap:16px; }
  .ais-pill { display:inline-flex; align-items:center; gap:7px; border-radius:999px; padding:8px 13px; font-size:12px; font-weight:800; letter-spacing:.04em; }
  .ais-pill-critical { background:#451a1a; color:#fca5a5; border:1px solid #7f1d1d; }
  .ais-pill-live { background:#123322; color:#86efac; border:1px solid #166534; }
  .ais-alert-details { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:18px; margin-top:23px; }
  .ais-detail { background:rgba(0,0,0,.15); border:1px solid #3a2630; border-radius:12px; padding:15px; }
  .ais-detail-label { display:block; color:#9ca3af; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; margin-bottom:8px; }
  .ais-detail-value { color:#f3f4f6; line-height:1.6; font-size:14px; }
  .ais-metrics { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:15px; margin-bottom:22px; }
  .ais-metric { position:relative; min-width:0; background:#111722; border:1px solid #273142; border-radius:15px; padding:20px; overflow:hidden; }
  .ais-metric:before { content:""; display:block; width:3px; position:absolute; left:0; top:0; bottom:0; background:#3b82f6; }
  .ais-metric:nth-child(2):before { background:#22c55e; }
  .ais-metric:nth-child(3):before { background:#a78bfa; }
  .ais-metric:nth-child(4):before { background:#f59e0b; }
  .ais-metric:nth-child(5):before { background:#f87171; }
  .ais-metric-label { color:#9ca3af; font-size:11px; font-weight:800; letter-spacing:.08em; }
  .ais-metric-value { color:#f9fafb; font-size:clamp(24px,3vw,32px); font-weight:800; margin-top:12px; letter-spacing:-.04em; overflow-wrap:anywhere; }
  .ais-metric-note { color:#6b7280; font-size:11px; margin-top:6px; }
  .ais-two-col { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; }
  .ais-insight { background:#0c111b; border:1px solid #273142; border-radius:12px; padding:17px; }
  .ais-insight h3 { color:#e5e7eb; font-size:15px; margin:0 0 9px; }
  .ais-insight p { color:#aeb7c5; font-size:14px; line-height:1.75; margin:0; }
  .ais-risk-value { font-weight:800; }
  .ais-error { background:#29151a; border:1px solid #7f1d1d; color:#fecaca; border-radius:12px; padding:16px; margin-bottom:22px; line-height:1.6; }
  .ais-error strong { color:#fff1f2; }
  .ais-loading { color:#d1d5db; padding:22px 0; }
  .ais-footer { text-align:right; color:#6b7280; font-size:12px; padding:3px 0 10px; }
  @media (max-width:1100px) { .ais-metrics { grid-template-columns:repeat(3,minmax(0,1fr)); } }
  @media (max-width:760px) {
    .ais-dashboard { padding:18px; }
    .ais-header { flex-direction:column; }
    .ais-refresh { width:100%; }
    .ais-metrics { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .ais-panel { padding:18px; }
    .ais-two-col { grid-template-columns:1fr; }
    .ais-alert-top { align-items:flex-start; flex-direction:column; }
  }
  @media (max-width:460px) {
    .ais-dashboard { padding:12px; }
    .ais-metrics { grid-template-columns:1fr; }
    .ais-metric { padding:17px; }
    .ais-panel h2 { font-size:18px; }
  }
`;

export default function MinisterDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAIS() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(AIS_FILE, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `AIS_file.csv could not be loaded (HTTP ${response.status}).`
          );
        }

        const csvText = await response.text();
        const parsed = parseCSV(csvText);

        if (!parsed.length) {
          throw new Error(
            "AIS_file.csv contains no valid data rows. Check that the CSV has a header row and at least one record."
          );
        }

        setRecords(parsed);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("AIS CSV loading error:", err);
        setRecords([]);
        setError(
          err.message ||
            "Unable to load AIS data. Check the AIS_file.csv file location."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadAIS();
    return () => controller.abort();
  }, [refreshKey]);

  const metrics = useMemo(() => calculateAISMetrics(records), [records]);

  const riskColor =
    metrics.riskLevel === "HIGH"
      ? "#f87171"
      : metrics.riskLevel === "MEDIUM"
      ? "#fbbf24"
      : "#4ade80";

  return (
    <div className="ais-dashboard">
      <style>{styles}</style>
      <main className="ais-main">
        <header className="ais-header">
          <div>
            <p className="ais-eyebrow">UCCIS · Unified Governance Intelligence</p>
            <h1 className="ais-title">Ministerial Operations Dashboard</h1>
            <p className="ais-subtitle">
              Executive operational intelligence powered by AIS telemetry
            </p>
            {/* <div className="ais-source">
              Data source: <strong>AIS_file.csv</strong>
              <span className="ais-muted"> · </span>
              <span className="ais-muted">Public path: {AIS_FILE}</span>
            </div> */}
          </div>
          {/* <button
            type="button"
            className="ais-refresh"
            onClick={() => setRefreshKey((key) => key + 1)}
            disabled={loading}
          >
            {loading ? "Loading AIS…" : "↻ Refresh AIS Data"}
          </button> */}
        </header>

        {error && (
          <div className="ais-error" role="alert">
            <strong>AIS Data Error</strong>
            <div>{error}</div>
            <div className="ais-muted" style={{ marginTop: 7, color: "#fca5a5" }}>
              Place the file at <strong>public/AIS_file.csv</strong> in your
              React app, so it is available at <strong>/AIS_file.csv</strong>.
            </div>
          </div>
        )}

        <section className="ais-panel ais-alert">
          <div className="ais-alert-top">
            <div>
              <p className="ais-eyebrow" style={{ color: "#f87171" }}>
                Priority incident · District operations
              </p>
              <h2>Critical Flood Risk Escalation</h2>
            </div>
            {/* <span className="ais-pill ais-pill-critical">● CRITICAL</span> */}
          </div>
          <div className="ais-alert-details">
            <div className="ais-detail">
              <span className="ais-detail-label">District</span>
              <div className="ais-detail-value">Thane West</div>
            </div>
            <div className="ais-detail">
              <span className="ais-detail-label">Operational impact</span>
              <div className="ais-detail-value">
                Waterlogging expected across multiple sectors.
              </div>
            </div>
            <div className="ais-detail">
              <span className="ais-detail-label">Citizen risk</span>
              <div className="ais-detail-value">
                Potential disruption to transport and emergency movement.
              </div>
            </div>
            <div className="ais-detail">
              <span className="ais-detail-label">Recommended action</span>
              <div className="ais-detail-value">
                Mobilize drainage response teams immediately.
              </div>
            </div>
            <div className="ais-detail">
              <span className="ais-detail-label">Assigned authority</span>
              <div className="ais-detail-value">District Control Office</div>
            </div>
          </div>
        </section>

        <section className="ais-metrics" aria-label="AIS summary metrics">
          <div className="ais-metric">
            <div className="ais-metric-label">AIS RECORDS</div>
            <div className="ais-metric-value">
              {loading ? "…" : metrics.totalRecords.toLocaleString()}
            </div>
            <div className="ais-metric-note">Rows loaded from CSV</div>
          </div>
          <div className="ais-metric">
            <div className="ais-metric-label">UNIQUE VESSELS</div>
            <div className="ais-metric-value">
              {loading ? "…" : metrics.uniqueVessels.toLocaleString()}
            </div>
            <div className="ais-metric-note">Distinct MMSI values</div>
          </div>
          <div className="ais-metric">
            <div className="ais-metric-label">AVERAGE SOG</div>
            <div className="ais-metric-value">
              {loading ? "…" : `${metrics.averageSOG} kn`}
            </div>
            <div className="ais-metric-note">Speed over ground</div>
          </div>
          <div className="ais-metric">
            <div className="ais-metric-label">MOVING RECORDS</div>
            <div className="ais-metric-value">
              {loading ? "…" : `${metrics.movingPercentage}%`}
            </div>
            <div className="ais-metric-note">Records with SOG above zero</div>
          </div>
          <div className="ais-metric">
            <div className="ais-metric-label">AIS RISK SCORE</div>
            <div className="ais-metric-value" style={{ color: riskColor }}>
              {loading ? "…" : metrics.riskScore}
            </div>
            <div className="ais-metric-note" style={{ color: riskColor }}>
              {loading ? "Calculating…" : `${metrics.riskLevel} · Calculated indicator`}
            </div>
          </div>
        </section>

        <section className="ais-panel">
          <div className="ais-panel-heading">
            <div>
              <h2>AIS Operational Intelligence</h2>
              <p className="ais-muted" style={{ margin: "7px 0 0", fontSize: 13 }}>
                Summary derived from the AIS records loaded from the CSV file
              </p>
            </div>
            {/* <span className="ais-pill ais-pill-live">
              <span>●</span> {loading ? "LOADING" : error ? "DATA ERROR" : "DATA LOADED"}
            </span> */}
          </div>

          {loading ? (
            <div className="ais-loading">Loading AIS telemetry from AIS_file.csv…</div>
          ) : (
            <div className="ais-two-col">
              <div className="ais-insight">
                <h3>Operational Activity</h3>
                <p>
                  AIS telemetry indicates{" "}
                  <strong className="ais-risk-value" style={{ color: riskColor }}>
                    {metrics.riskLevel.toLowerCase()}
                  </strong>{" "}
                  calculated activity risk. The score is an indicator based on
                  movement percentage and average speed, not an official risk
                  assessment.
                </p>
              </div>
              <div className="ais-insight">
                <h3>Resource Pressure</h3>
                <p>
                  {metrics.movingPercentage}% of AIS records show vessel movement,
                  with an average speed over ground of {metrics.averageSOG} knots.
                  Use this telemetry alongside current operational reports.
                </p>
              </div>
              <div className="ais-insight">
                <h3>Governance Risk Indicator</h3>
                <p>
                  Current calculated AIS score:{" "}
                  <strong className="ais-risk-value" style={{ color: riskColor }}>
                    {metrics.riskScore} / 100 ({metrics.riskLevel})
                  </strong>
                  . It is computed from the available rows and should not be
                  interpreted as a verified flood or safety forecast.
                </p>
              </div>
              <div className="ais-insight">
                <h3>Dataset Coverage</h3>
                <p>
                  {metrics.totalRecords.toLocaleString()} records,{" "}
                  {metrics.uniqueVessels.toLocaleString()} unique vessels, and{" "}
                  {metrics.vesselTypes.toLocaleString()} vessel types were found
                  in the loaded AIS dataset.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="ais-panel">
          <div className="ais-panel-heading">
            <div>
              <h2>District Operational Status</h2>
              <p className="ais-muted" style={{ margin: "7px 0 0", fontSize: 13 }}>
                Operational notes shown for the dashboard context
              </p>
            </div>
          </div>
          <div className="ais-two-col">
            <div className="ais-insight">
              <h3>Operational Stability</h3>
              <p>Operationally stable with moderate traffic congestion.</p>
            </div>
            <div className="ais-insight">
              <h3>Resource Pressure</h3>
              <p>Drainage teams operating at 82% utilization.</p>
            </div>
            <div className="ais-insight">
              <h3>Governance Risks</h3>
              <p>Flood escalation risk increasing in eastern sectors.</p>
            </div>
            <div className="ais-insight">
              <h3>AIS Data Status</h3>
              <p>
                {error
                  ? "AIS data could not be loaded. Verify the CSV path and column headers."
                  : loading
                  ? "Loading the AIS dataset."
                  : `Loaded ${metrics.totalRecords.toLocaleString()} AIS records successfully.`}
              </p>
            </div>
          </div>
        </section>

        {/* <footer className="ais-footer">
          Data source: <strong>AIS_file.csv</strong> · AIS metrics are calculated
          from the loaded dataset.
        </footer> */}
      </main>
    </div>
  );
}
