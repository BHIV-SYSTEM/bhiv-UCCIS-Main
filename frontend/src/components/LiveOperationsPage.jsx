import React, { useEffect, useMemo, useState } from "react";
const AIS_DASHBOARD_STYLES = String.raw`
/* Embedded styles: no separate CSS file required */
.ais-page {
  --ais-bg: #f3f6fb;
  --ais-card: #ffffff;
  --ais-text: #172033;
  --ais-muted: #64748b;
  --ais-border: #e2e8f0;
  --ais-blue: #2563eb;
  --ais-purple: #7c3aed;
  --ais-green: #16a34a;
  --ais-orange: #ea580c;
  --ais-red: #dc2626;
  --ais-cyan: #0891b2;
  min-height: 100vh; padding: 28px; box-sizing: border-box;
  background: var(--ais-bg); color: var(--ais-text);
  font-family: Inter, "Segoe UI", Arial, sans-serif; font-size: 14px;
}
.ais-page *, .ais-page *::before, .ais-page *::after { box-sizing: border-box; }
.ais-page h1, .ais-page h2, .ais-page h3, .ais-page p { margin-top: 0; }
.ais-header { display:flex; justify-content:space-between; align-items:center; gap:24px; flex-wrap:wrap; margin-bottom:26px; }
.ais-eyebrow { margin-bottom:9px; color:var(--ais-blue); font-size:11px; font-weight:800; letter-spacing:2px; }
.ais-header h1 { margin-bottom:8px; color:#ffffff; font-size:clamp(25px,3vw,34px); font-weight:800; letter-spacing:-1px; line-height:1.25; }
.ais-header p { margin-bottom:0; color:var(--ais-muted); font-size:14px; line-height:1.6; }
.ais-source-status { display:flex; align-items:center; gap:9px; flex-wrap:wrap; padding:12px 16px; border:1px solid #bbf7d0; border-radius:12px; background:#f0fdf4; color:#166534; font-size:11px; font-weight:800; letter-spacing:.5px; }
.ais-source-status small { width:100%; padding-left:18px; color:#15803d; font-size:12px; font-weight:500; letter-spacing:0; }
.ais-status-dot { width:9px; height:9px; flex-shrink:0; border-radius:50%; background:#22c55e; box-shadow:0 0 0 4px #dcfce7; }
.ais-metrics-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; margin-bottom:22px; }
.ais-metric-card { min-width:0; padding:20px; overflow:hidden; border:1px solid var(--ais-border); border-radius:15px; background:var(--ais-card); box-shadow:0 4px 14px rgb(15 23 42 / 3%); transition:transform .2s ease,box-shadow .2s ease; }
.ais-metric-card:hover { transform:translateY(-3px); box-shadow:0 10px 25px rgb(15 23 42 / 8%); }
.ais-metric-top { display:flex; align-items:center; gap:9px; margin-bottom:17px; }
.ais-metric-dot { width:10px; height:10px; flex-shrink:0; border-radius:50%; }
.ais-metric-dot.blue { background:var(--ais-blue); } .ais-metric-dot.purple { background:var(--ais-purple); } .ais-metric-dot.green { background:var(--ais-green); } .ais-metric-dot.orange { background:var(--ais-orange); } .ais-metric-dot.red { background:var(--ais-red); } .ais-metric-dot.cyan { background:var(--ais-cyan); }
.ais-metric-label { color:#64748b; font-size:12px; font-weight:650; line-height:1.4; }
.ais-metric-value { margin-bottom:9px; overflow-wrap:anywhere; color:#111827; font-size:clamp(24px,2.2vw,31px); font-weight:800; letter-spacing:-1px; }
.ais-metric-note { color:#64748b; font-size:12px; line-height:1.5; }
.ais-charts-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px; margin-bottom:22px; }
.ais-charts-primary { grid-template-columns:minmax(0,1.65fr) minmax(0,1fr); }
.ais-chart-card { min-width:0; padding:23px; border:1px solid var(--ais-border); border-radius:16px; background:var(--ais-card); box-shadow:0 4px 14px rgb(15 23 42 / 3%); }
.ais-chart-heading { margin-bottom:22px; }
.ais-chart-heading h2 { margin-bottom:7px; color:#111827; font-size:17px; font-weight:750; letter-spacing:-.3px; }
.ais-chart-heading p { margin-bottom:0; color:var(--ais-muted); font-size:12px; line-height:1.6; }
.ais-svg-scroll { width:100%; overflow-x:auto; overflow-y:hidden; scrollbar-width:thin; scrollbar-color:#cbd5e1 transparent; }
.ais-svg-chart { display:block; width:100%; min-width:420px; height:auto; overflow:visible; }
.ais-grid-line { stroke:#e8edf5; stroke-width:1; stroke-dasharray:4 5; }
.ais-tick-label { fill:#64748b; font-family:inherit; font-size:10px; }
.ais-axis-title { fill:#475569; font-family:inherit; font-size:11px; font-weight:650; }
.ais-line { fill:none; stroke:#2563eb; stroke-width:3; stroke-linecap:round; stroke-linejoin:round; }
.ais-line-point { fill:#fff; stroke:#2563eb; stroke-width:2.5; transition:r .2s ease; }
.ais-line-point:hover { fill:#2563eb; }
.ais-donut-layout { display:flex; align-items:center; justify-content:center; gap:24px; min-height:230px; }
.ais-donut { width:min(180px,48%); height:auto; flex-shrink:0; overflow:visible; }
.ais-donut-track { fill:none; stroke:#e9eef5; stroke-width:15; }
.ais-donut-moving { fill:none; stroke:#2563eb; stroke-width:15; stroke-linecap:round; transition:stroke-dasharray .4s ease; }
.ais-donut-number { fill:#111827; font-family:inherit; font-size:21px; font-weight:800; text-anchor:middle; }
.ais-donut-caption { fill:#64748b; font-family:inherit; font-size:9px; font-weight:750; letter-spacing:1px; text-anchor:middle; }
.ais-donut-legend { display:flex; flex-direction:column; gap:17px; min-width:0; flex:1; }
.ais-donut-legend > div { display:grid; grid-template-columns:11px minmax(0,1fr) auto; align-items:center; gap:9px; color:#475569; font-size:12px; }
.ais-donut-legend strong { color:#111827; font-size:13px; font-weight:750; }
.ais-legend-swatch { width:10px; height:10px; border-radius:3px; }
.ais-legend-swatch.moving { background:#2563eb; } .ais-legend-swatch.stationary { background:#f59e0b; }
.ais-donut-legend .ais-legend-total { display:flex; justify-content:space-between; gap:10px; padding-top:14px; border-top:1px solid var(--ais-border); color:#64748b; font-size:11px; }
.ais-bar-chart { display:flex; flex-direction:column; gap:19px; width:100%; }
.ais-bar-row { display:grid; grid-template-columns:100px minmax(50px,1fr) 65px; align-items:center; gap:12px; }
.ais-bar-label { color:#475569; font-size:11px; font-weight:600; line-height:1.4; }
.ais-bar-track { width:100%; height:10px; overflow:hidden; border-radius:20px; background:#edf2f7; }
.ais-bar-fill { height:100%; min-width:0; border-radius:inherit; background:linear-gradient(90deg,#3b82f6,#6366f1); transition:width .5s ease; }
.ais-bar-fill.hotspot { background:linear-gradient(90deg,#06b6d4,#2563eb); }
.ais-bar-value { color:#172033; font-size:12px; font-weight:750; text-align:right; font-variant-numeric:tabular-nums; }
.ais-hotspot-row { display:grid; grid-template-columns:28px minmax(0,1fr) 65px; align-items:center; gap:12px; }
.ais-hotspot-rank { display:flex; align-items:center; justify-content:center; width:27px; height:27px; border-radius:8px; background:#eff6ff; color:#2563eb; font-size:11px; font-weight:800; }
.ais-hotspot-content { min-width:0; } .ais-hotspot-label { margin-bottom:8px; color:#475569; font-size:11px; font-weight:650; }
.ais-alert-list { display:flex; flex-direction:column; gap:12px; }
.ais-alert { display:flex; align-items:flex-start; gap:12px; padding:15px; border:1px solid; border-radius:11px; }
.ais-alert.high { border-color:#fecaca; background:#fff5f5; } .ais-alert.medium { border-color:#fed7aa; background:#fffaf2; } .ais-alert.info { border-color:#bfdbfe; background:#f4f8ff; }
.ais-alert-icon { display:flex; align-items:center; justify-content:center; width:25px; height:25px; flex-shrink:0; border-radius:50%; background:#fff; font-size:15px; font-weight:800; }
.ais-alert.high .ais-alert-icon { color:#dc2626; } .ais-alert.medium .ais-alert-icon { color:#ea580c; } .ais-alert.info .ais-alert-icon { color:#2563eb; }
.ais-alert h3 { margin-bottom:5px; color:#172033; font-size:12px; font-weight:750; } .ais-alert p { margin-bottom:0; color:#64748b; font-size:12px; line-height:1.6; }
.ais-table-wrap { width:100%; overflow-x:auto; border:1px solid var(--ais-border); border-radius:10px; }
.ais-table { width:100%; min-width:470px; border-collapse:collapse; background:#fff; text-align:left; }
.ais-table thead { background:#f1f5f9; }
.ais-table th { padding:13px 12px; color:#334155; font-size:11px; font-weight:800; white-space:nowrap; }
.ais-table td { padding:14px 12px; border-top:1px solid #edf1f6; color:#475569; font-size:12px; white-space:nowrap; }
.ais-table tbody tr { transition:background .2s ease; } .ais-table tbody tr:hover { background:#f8fafc; } .ais-table td:first-child { color:#1d4ed8; font-weight:700; }
.ais-empty-chart { display:flex; align-items:center; justify-content:center; min-height:130px; margin:0; padding:20px; border:1px dashed #cbd5e1; border-radius:10px; background:#f8fafc; color:#64748b; font-size:12px; text-align:center; }
.ais-state-card { display:flex; flex-direction:column; align-items:center; justify-content:center; max-width:650px; min-height:300px; margin:70px auto; padding:40px; border:1px solid var(--ais-border); border-radius:18px; background:#fff; box-shadow:0 10px 30px rgb(15 23 42 / 5%); text-align:center; }
.ais-state-card h1, .ais-state-card h2 { margin-bottom:12px; color:#172033; font-size:22px; font-weight:800; }
.ais-state-card p { margin-bottom:8px; color:#64748b; font-size:13px; line-height:1.7; overflow-wrap:anywhere; }
.ais-state-card code { padding:3px 6px; border-radius:5px; background:#eff6ff; color:#1d4ed8; font-size:12px; }
.ais-error-card { border-color:#fecaca; } .ais-error-card h1 { color:#b91c1c; }
.ais-loader { width:42px; height:42px; margin-bottom:22px; border:4px solid #dbeafe; border-top-color:#2563eb; border-radius:50%; animation:ais-spin .8s linear infinite; }
@keyframes ais-spin { to { transform:rotate(360deg); } }
.ais-footer { display:flex; justify-content:space-between; gap:18px; flex-wrap:wrap; padding:18px 4px 5px; color:#64748b; font-size:11px; line-height:1.7; }
.ais-footer strong { color:#334155; }
@media (max-width:1100px) { .ais-metrics-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .ais-charts-primary, .ais-charts-grid { grid-template-columns:minmax(0,1fr); } }
@media (max-width:650px) {
  .ais-page { padding:15px; } .ais-header { align-items:flex-start; gap:18px; } .ais-header h1 { font-size:25px; } .ais-source-status { width:100%; }
  .ais-metrics-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; } .ais-metric-card { padding:14px; }
  .ais-metric-top { align-items:flex-start; gap:7px; margin-bottom:13px; } .ais-metric-label { font-size:11px; } .ais-metric-value { font-size:23px; } .ais-metric-note { font-size:11px; }
  .ais-chart-card { padding:16px; } .ais-chart-heading h2 { font-size:16px; } .ais-donut-layout { flex-direction:column; gap:18px; padding:8px 0; } .ais-donut { width:160px; max-width:100%; } .ais-donut-legend { width:100%; }
  .ais-bar-row { grid-template-columns:82px minmax(35px,1fr) 48px; gap:8px; } .ais-bar-label, .ais-hotspot-label { font-size:10px; } .ais-hotspot-row { grid-template-columns:25px minmax(0,1fr) 48px; gap:8px; }
  .ais-footer { flex-direction:column; gap:8px; } .ais-state-card { margin:25px auto; padding:24px; }
}
@media (prefers-reduced-motion:reduce) { .ais-page *, .ais-page *::before, .ais-page *::after { animation-duration:.01ms !important; transition-duration:.01ms !important; } }

`;






const AIS_FILE_PATH = "/AIS_file.csv";

const HIGH_SPEED_THRESHOLD = 10;

const UNAVAILABLE_SOG = 102.3;



const numberFormat = (value) =>

  Number(value || 0).toLocaleString("en-IN");



function parseCSVLine(line) {

  const values = [];

  let current = "";

  let quoted = false;



  for (let i = 0; i < line.length; i++) {

    const char = line[i];



    if (char === '"') {

      if (quoted && line[i + 1] === '"') {

        current += '"';

        i++;

      } else {

        quoted = !quoted;

      }

    } else if (char === "," && !quoted) {

      values.push(current.trim());

      current = "";

    } else {

      current += char;

    }

  }



  values.push(current.trim());

  return values;

}



function parseAISCSV(text) {

  const lines = text

    .replace(/^\uFEFF/, "")

    .split(/\r?\n/)

    .filter((line) => line.trim());



  if (lines.length < 2) {

    throw new Error("The CSV file has no AIS records.");

  }



  const headers = parseCSVLine(lines[0]).map((header) =>

    header.trim().toLowerCase()

  );



  const required = [

    "mmsi",

    "basedatetime",

    "lat",

    "lon",

    "sog",

  ];



  const missing = required.filter(

    (column) => !headers.includes(column)

  );



  if (missing.length) {

    throw new Error(

      `Missing required columns: ${missing.join(", ")}`

    );

  }



  return lines.slice(1).map((line, index) => {

    const values = parseCSVLine(line);

    const row = {};



    headers.forEach((header, i) => {

      row[header] = values[i] ?? "";

    });



    const numeric = (value) => {

      if (String(value).trim() === "") return null;

      const result = Number(value);

      return Number.isFinite(result) ? result : null;

    };



    return {

      id: index + 1,

      mmsi: String(row.mmsi).trim(),

      timestamp: String(row.basedatetime).trim(),

      lat: numeric(row.lat),

      lon: numeric(row.lon),

      sog: numeric(row.sog),

      vesselType: row.vesseltype || "Unknown",

    };

  }).filter((row) => row.mmsi);

}



function analyzeAIS(records) {

  const validSog = records.filter(

    (r) => r.sog !== null &&

      r.sog >= 0 &&

      r.sog < UNAVAILABLE_SOG

  );



  const moving = validSog.filter((r) => r.sog > 0);

  const stationary = validSog.filter((r) => r.sog === 0);



  const unavailable = records.filter(

    (r) =>

      r.sog === null ||

      r.sog < 0 ||

      r.sog >= UNAVAILABLE_SOG

  );



  const highSpeed = validSog.filter(

    (r) => r.sog >= HIGH_SPEED_THRESHOLD

  );



  const coordinates = records.filter(

    (r) =>

      r.lat !== null &&

      r.lon !== null &&

      r.lat >= -90 &&

      r.lat <= 90 &&

      r.lon >= -180 &&

      r.lon <= 180

  );



  // Group observations into one-minute intervals.

  const minuteMap = new Map();



  records.forEach((r) => {

    const parsed = Date.parse(r.timestamp);

    if (!Number.isFinite(parsed)) return;



    const date = new Date(parsed);

    date.setSeconds(0, 0);



    const key = date.toISOString();



    if (!minuteMap.has(key)) {

      minuteMap.set(key, {

        timestamp: key,

        label: date.toLocaleTimeString("en-GB", {

          hour: "2-digit",

          minute: "2-digit",

          timeZone: "UTC",

        }),

        records: 0,

      });

    }



    minuteMap.get(key).records++;

  });



  const temporal = [...minuteMap.values()]

    .sort((a, b) =>

      a.timestamp.localeCompare(b.timestamp)

    );



  // SOG distribution excludes unavailable speed sentinels.

  const sogBins = [

    { label: "Stationary", min: 0, max: 0 },

    { label: "0–5 kn", min: 0, max: 5 },

    { label: "5–10 kn", min: 5, max: 10 },

    { label: "10–15 kn", min: 10, max: 15 },

    { label: "15–20 kn", min: 15, max: 20 },

    { label: "20–25 kn", min: 20, max: 25 },

    { label: "25–30 kn", min: 25, max: 30 },

    { label: "30+ kn", min: 30, max: Infinity },

  ];



  const speedDistribution = sogBins.map((bin) => ({

    label: bin.label,

    value: validSog.filter((r) => {

      if (bin.label === "Stationary") return r.sog === 0;

      return r.sog > bin.min && r.sog <= bin.max;

    }).length,

  }));



  // Group records into 0.5° spatial cells.

  const cellMap = new Map();



  coordinates.forEach((r) => {

    const lat = Math.floor(r.lat * 2) / 2;

    const lon = Math.floor(r.lon * 2) / 2;

    const key = `${lat},${lon}`;



    if (!cellMap.has(key)) {

      cellMap.set(key, {

        label: `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`,

        value: 0,

      });

    }



    cellMap.get(key).value++;

  });



  const hotspots = [...cellMap.values()]

    .sort((a, b) => b.value - a.value)

    .slice(0, 8);



  const stationaryPct = validSog.length

    ? (stationary.length / validSog.length) * 100

    : 0;



  const movingPct = validSog.length

    ? (moving.length / validSog.length) * 100

    : 0;



  const maxSog = validSog.length

    ? Math.max(...validSog.map((r) => r.sog))

    : 0;



  const avgSog = validSog.length

    ? validSog.reduce((sum, r) => sum + r.sog, 0) /

      validSog.length

    : 0;



  const alerts = [];



  if (highSpeed.length) {

    alerts.push({

      title: "High-speed AIS observations",

      detail: `${numberFormat(highSpeed.length)} records have SOG ≥ ${HIGH_SPEED_THRESHOLD} knots.`,

      level: "high",

    });

  }



  if (stationary.length) {

    alerts.push({

      title: "Stationary vessel observations",

      detail: `${stationaryPct.toFixed(2)}% of valid SOG observations report zero speed.`,

      level: "medium",

    });

  }



  if (unavailable.length) {

    alerts.push({

      title: "Unavailable speed data",

      detail: `${numberFormat(unavailable.length)} records have unavailable or invalid SOG values.`,

      level: "info",

    });

  }



  return {

    total: records.length,

    vessels: new Set(records.map((r) => r.mmsi)).size,

    moving: moving.length,

    stationary: stationary.length,

    validSog: validSog.length,

    unavailable: unavailable.length,

    highSpeed: highSpeed.length,

    coordinates: coordinates.length,

    movingPct,

    stationaryPct,

    avgSog,

    maxSog,

    temporal,

    speedDistribution,

    hotspots,

    alerts,

    recent: [...records].slice(-8).reverse(),

  };

}



function MetricCard({ label, value, note, color }) {

  return (

    <article className="ais-metric-card">

      <div className="ais-metric-top">

        <span className={`ais-metric-dot ${color || ""}`} />

        <span className="ais-metric-label">{label}</span>

      </div>

      <div className="ais-metric-value">{value}</div>

      <div className="ais-metric-note">{note}</div>

    </article>

  );

}



function ChartCard({ title, subtitle, children }) {

  return (

    <section className="ais-chart-card">

      <div className="ais-chart-heading">

        <h2>{title}</h2>

        {subtitle && <p>{subtitle}</p>}

      </div>

      {children}

    </section>

  );

}



function LineChart({ data }) {

  const width = 720;

  const height = 310;

  const left = 66;

  const right = 22;

  const top = 20;

  const bottom = 65;



  const chartW = width - left - right;

  const chartH = height - top - bottom;

  const max = Math.max(...data.map((d) => d.records), 1);



  const points = data.map((d, i) => {

    const x =

      left + (i / Math.max(data.length - 1, 1)) * chartW;

    const y = top + chartH - (d.records / max) * chartH;

    return `${x},${y}`;

  }).join(" ");



  return (

    <div className="ais-svg-scroll">

      <svg

        viewBox={`0 0 ${width} ${height}`}

        className="ais-svg-chart"

        role="img"

        aria-label="AIS records over time"

      >

        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {

          const y = top + chartH - fraction * chartH;

          return (

            <g key={fraction}>

              <line

                x1={left}

                y1={y}

                x2={width - right}

                y2={y}

                className="ais-grid-line"

              />

              <text

                x={left - 10}

                y={y + 4}

                textAnchor="end"

                className="ais-tick-label"

              >

                {numberFormat(Math.round(max * fraction))}

              </text>

            </g>

          );

        })}



        {data.map((d, i) => {

          const x =

            left + (i / Math.max(data.length - 1, 1)) * chartW;

          const y = top + chartH - (d.records / max) * chartH;



          return (

            <text

              key={d.timestamp}

              x={x}

              y={top + chartH + 19}

              textAnchor="middle"

              className="ais-tick-label"

            >

              {d.label}

            </text>

          );

        })}



        {data.length > 1 && (

          <polyline

            points={points}

            className="ais-line"

          />

        )}



        {data.map((d, i) => {

          const x =

            left + (i / Math.max(data.length - 1, 1)) * chartW;

          const y = top + chartH - (d.records / max) * chartH;



          return (

            <circle

              key={d.timestamp}

              cx={x}

              cy={y}

              r="4"

              className="ais-line-point"

            />

          );

        })}



        <text

          x={left + chartW / 2}

          y={height - 12}

          textAnchor="middle"

          className="ais-axis-title"

        >

          Time (UTC minute)

        </text>



        <text

          x="17"

          y={top + chartH / 2}

          textAnchor="middle"

          className="ais-axis-title"

          transform={`rotate(-90 17 ${top + chartH / 2})`}

        >

          Number of AIS records

        </text>

      </svg>

    </div>

  );

}



function DonutChart({ moving, stationary }) {

  const total = moving + stationary;

  const movingPct = total ? (moving / total) * 100 : 0;

  const circumference = 2 * Math.PI * 58;

  const movingLength = (movingPct / 100) * circumference;



  return (

    <div className="ais-donut-layout">

      <svg

        viewBox="0 0 160 160"

        className="ais-donut"

        role="img"

        aria-label="Moving and stationary AIS observations"

      >

        <circle

          cx="80"

          cy="80"

          r="58"

          className="ais-donut-track"

        />

        <circle

          cx="80"

          cy="80"

          r="58"

          className="ais-donut-moving"

          strokeDasharray={`${movingLength} ${circumference}`}

          transform="rotate(-90 80 80)"

        />

        <text x="80" y="76" className="ais-donut-number">

          {movingPct.toFixed(1)}%

        </text>

        <text x="80" y="94" className="ais-donut-caption">

          MOVING

        </text>

      </svg>



      <div className="ais-donut-legend">

        <div>

          <span className="ais-legend-swatch moving" />

          <span>Moving</span>

          <strong>{numberFormat(moving)}</strong>

        </div>

        <div>

          <span className="ais-legend-swatch stationary" />

          <span>Stationary</span>

          <strong>{numberFormat(stationary)}</strong>

        </div>

        <div className="ais-legend-total">

          <span>Total valid SOG</span>

          <strong>{numberFormat(total)}</strong>

        </div>

      </div>

    </div>

  );

}



function BarChart({ data }) {

  const max = Math.max(...data.map((d) => d.value), 1);



  return (

    <div className="ais-bar-chart">

      {data.map((item) => (

        <div className="ais-bar-row" key={item.label}>

          <div className="ais-bar-label">{item.label}</div>

          <div className="ais-bar-track">

            <div

              className="ais-bar-fill"

              style={{

                width: `${(item.value / max) * 100}%`,

              }}

            />

          </div>

          <div className="ais-bar-value">

            {numberFormat(item.value)}

          </div>

        </div>

      ))}

    </div>

  );

}



function HotspotChart({ data }) {

  const max = Math.max(...data.map((d) => d.value), 1);



  if (!data.length) {

    return <p className="ais-empty-chart">No valid coordinates found.</p>;

  }



  return (

    <div className="ais-bar-chart">

      {data.map((item, index) => (

        <div className="ais-hotspot-row" key={item.label}>

          <div className="ais-hotspot-rank">{index + 1}</div>

          <div className="ais-hotspot-content">

            <div className="ais-hotspot-label">{item.label}</div>

            <div className="ais-bar-track">

              <div

                className="ais-bar-fill hotspot"

                style={{

                  width: `${(item.value / max) * 100}%`,

                }}

              />

            </div>

          </div>

          <strong className="ais-bar-value">

            {numberFormat(item.value)}

          </strong>

        </div>

      ))}

    </div>

  );

}



export default function LiveOperationsPage() {

  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  useEffect(() => {

    let cancelled = false;



    async function loadFile() {

      try {

        const response = await fetch(AIS_FILE_PATH, {

          cache: "no-store",

        });



        if (!response.ok) {

          throw new Error(

            `Unable to load ${AIS_FILE_PATH} (HTTP ${response.status}).`

          );

        }



        const csv = await response.text();

        const parsed = parseAISCSV(csv);



        if (!parsed.length) {

          throw new Error("No AIS records found in the CSV.");

        }



        if (!cancelled) setRecords(parsed);

      } catch (err) {

        if (!cancelled) {

          setError(err.message || "Failed to load AIS data.");

        }

      } finally {

        if (!cancelled) setLoading(false);

      }

    }



    loadFile();



    return () => {

      cancelled = true;

    };

  }, []);



  const ais = useMemo(() => analyzeAIS(records), [records]);



  if (loading) {

    return (

      <main className="ais-page">
        <style>{AIS_DASHBOARD_STYLES}</style>

        <div className="ais-state-card">

          <div className="ais-loader" />

          <h2>Loading AIS Operations Dashboard</h2>

          <p>Reading AIS_file.csv and calculating analytics...</p>

        </div>

      </main>

    );

  }



  if (error) {

    return (

      <main className="ais-page">
        <style>{AIS_DASHBOARD_STYLES}</style>

        <div className="ais-state-card ais-error-card">

          <h1>Unable to load AIS data</h1>

          <p>{error}</p>

          <p>

            Put <code>AIS_file.csv</code> inside the React app's

            <code> public/</code> directory.

          </p>

        </div>

      </main>

    );

  }



  return (

    <main className="ais-page">
        <style>{AIS_DASHBOARD_STYLES}</style>

      <header className="ais-header">

        <div>

          {/* <div className="ais-eyebrow">

            MARITIME INTELLIGENCE / PHASE 7

          </div> */}

          <h1>Live Operational Control Layer</h1>

          <p>

            AIS-derived vessel movement, speed analysis and spatial

            activity.

          </p>

        </div>



        {/* <div className="ais-source-status">

          <span className="ais-status-dot" />

          AIS DATA LOADED

          <small>{numberFormat(ais.total)} records</small>

        </div> */}

      </header>



      <section className="ais-metrics-grid">

        <MetricCard

          label="AIS Records"

          value={numberFormat(ais.total)}

          note="Loaded observations"

          color="blue"

        />

        <MetricCard

          label="Unique Vessels"

          value={numberFormat(ais.vessels)}

          note="Distinct MMSI values"

          color="purple"

        />

        <MetricCard

          label="Moving Records"

          value={numberFormat(ais.moving)}

          note={`${ais.movingPct.toFixed(1)}% of valid SOG`}

          color="green"

        />

        <MetricCard

          label="Stationary Records"

          value={numberFormat(ais.stationary)}

          note={`${ais.stationaryPct.toFixed(1)}% of valid SOG`}

          color="orange"

        />

        <MetricCard

          label="High-Speed Records"

          value={numberFormat(ais.highSpeed)}

          note="SOG ≥ 10 knots"

          color="red"

        />

        <MetricCard

          label="Average SOG"

          value={`${ais.avgSog.toFixed(2)} kn`}

          note={`Maximum ${ais.maxSog.toFixed(1)} kn`}

          color="cyan"

        />

        <MetricCard

          label="Valid Coordinates"

          value={numberFormat(ais.coordinates)}

          note="Valid latitude and longitude"

          color="green"

        />

        <MetricCard

          label="Unavailable SOG"

          value={numberFormat(ais.unavailable)}

          note="Missing or unavailable speed"

          color="orange"

        />

      </section>



      <section className="ais-charts-grid ais-charts-primary">

        <ChartCard

          title="AIS Temporal Activity"

          subtitle="Record volume grouped by minute"

        >

          {ais.temporal.length ? (

            <LineChart data={ais.temporal} />

          ) : (

            <p className="ais-empty-chart">

              No valid timestamps found in the dataset.

            </p>

          )}

        </ChartCard>



        <ChartCard

          title="Movement Composition"

          subtitle="Moving versus stationary observations"

        >

          <DonutChart

            moving={ais.moving}

            stationary={ais.stationary}

          />

        </ChartCard>

      </section>



      <section className="ais-charts-grid">

        <ChartCard

          title="Speed Distribution"

          subtitle="Number of valid observations in each SOG range"

        >

          <BarChart data={ais.speedDistribution} />

        </ChartCard>



        <ChartCard

          title="Top AIS Spatial Cells"

          subtitle="Most frequently observed 0.5° × 0.5° cells"

        >

          <HotspotChart data={ais.hotspots} />

        </ChartCard>

      </section>



      <section className="ais-charts-grid ais-bottom-grid">

        <ChartCard

          title="AIS Activity Alerts"

          subtitle="Data-derived indicators, not confirmed incidents"

        >

          <div className="ais-alert-list">

            {ais.alerts.map((alert) => (

              <article

                className={`ais-alert ${alert.level}`}

                key={alert.title}

              >

                <span className="ais-alert-icon">

                  {alert.level === "high"

                    ? "!"

                    : alert.level === "medium"

                    ? "•"

                    : "i"}

                </span>

                <div>

                  <h3>{alert.title}</h3>

                  <p>{alert.detail}</p>

                </div>

              </article>

            ))}

          </div>

        </ChartCard>



        <ChartCard

          title="Recent AIS Records"

          subtitle="Latest rows in the loaded CSV file"

        >

          <div className="ais-table-wrap">

            <table className="ais-table">

              <thead>

                <tr>

                  <th>MMSI</th>

                  <th>Timestamp</th>

                  <th>SOG (kn)</th>

                  <th>Vessel type</th>

                </tr>

              </thead>

              <tbody>

                {ais.recent.map((row) => (

                  <tr key={row.id}>

                    <td>{row.mmsi}</td>

                    <td>{row.timestamp || "—"}</td>

                    <td>

                      {row.sog === null ||

                      row.sog >= UNAVAILABLE_SOG

                        ? "Unavailable"

                        : row.sog.toFixed(1)}

                    </td>

                    <td>{row.vesselType}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </ChartCard>

      </section>



      <footer className="ais-footer">

        <div>

          <strong>Source:</strong> {AIS_FILE_PATH}

        </div>

        <div>

          Spatial cells are coordinate-based, not administrative

          districts. AIS activity alone does not establish an incident,

          response delay, or operational ETA.

        </div>

      </footer>

    </main>

  );

}
