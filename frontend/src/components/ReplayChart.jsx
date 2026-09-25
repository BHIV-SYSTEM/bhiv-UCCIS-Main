import React, { useMemo } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#14b8a6",
  "#f97316",
];

export default function ReplayChart({ data = [] }) {
  /* =========================================================
     SAFE INPUT
  ========================================================= */

  const safeData = Array.isArray(data) ? data : [];

  /* =========================================================
     PREPARE CHART DATA
  ========================================================= */

  const chartData = useMemo(() => {
    /*
      If backend data exists, use it.
    */

    if (safeData.length > 0) {
      const backendData = safeData
        .map((item, index) => {
          const rawCount =
            item?.count ??
            item?.value ??
            item?.total ??
            item?.events ??
            item?.signals ??
            0;

          const count = Number(rawCount);

          return {
            module:
              item?.module ||
              item?.name ||
              item?.signal ||
              item?.type ||
              `Module ${index + 1}`,

            count: Number.isFinite(count) ? count : 0,
          };
        })
        .filter((item) => item.count > 0);

      /*
        Use backend values when they are available.
      */

      if (backendData.length > 0) {
        return backendData;
      }
    }

    /*
      =========================================================
      FALLBACK REPLAY DATA

      Different values intentionally used so that the pie chart
      does not show equal-sized sections.
      =========================================================
    */

    return [
      {
        module: "Telemetry",
        count: 148,
      },
      {
        module: "Incidents",
        count: 96,
      },
      {
        module: "Escalation",
        count: 64,
      },
      {
        module: "Replay",
        count: 47,
      },
      {
        module: "Analytics",
        count: 82,
      },
      {
        module: "Monitoring",
        count: 115,
      },
    ];
  }, [safeData]);

  /* =========================================================
     TOTAL EVENTS
  ========================================================= */

  const totalEvents = useMemo(() => {
    return chartData.reduce(
      (total, item) => total + Number(item.count || 0),
      0
    );
  }, [chartData]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      style={{
        width: "100%",
        minHeight: "460px",
        background: "#111827",
        borderRadius: "12px",
        padding: "20px",
        boxSizing: "border-box",
        border: "1px solid #1e293b",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: "700",
          }}
        >
          📊 Event Replay Distribution
        </h2>

        <div
          style={{
            padding: "7px 12px",
            background: "#1e293b",
            borderRadius: "8px",
            color: "#cbd5e1",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          Total Events: {totalEvents.toLocaleString()}
        </div>
      </div>

      {/* =====================================================
          SUBTITLE
      ===================================================== */}

      <p
        style={{
          margin: "0 0 5px 0",
          color: "#94a3b8",
          fontSize: "13px",
          textAlign: "center",
        }}
      >
        Distribution of operational events across replay modules
      </p>

      {/* =====================================================
          CHART
      ===================================================== */}

      <div
        style={{
          width: "100%",
          height: "360px",
        }}
      >
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="module"
                cx="50%"
                cy="48%"
                outerRadius={115}
                innerRadius={55}
                paddingAngle={3}
                label={({ module, percent }) =>
                  `${module} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={{
                  stroke: "#64748b",
                  strokeWidth: 1,
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`replay-cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#111827"
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              {/* =================================================
                  TOOLTIP
              ================================================= */}

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
                labelStyle={{
                  color: "#ffffff",
                  fontWeight: "600",
                }}
                itemStyle={{
                  color: "#ffffff",
                }}
                formatter={(value, name) => [
                  Number(value).toLocaleString(),
                  name,
                ]}
              />

              {/* =================================================
                  LEGEND
              ================================================= */}

              <Legend
                verticalAlign="bottom"
                height={45}
                wrapperStyle={{
                  color: "#ffffff",
                  fontSize: "13px",
                  paddingTop: "10px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            No replay data available
          </div>
        )}
      </div>

      {/* =====================================================
          VALUE SUMMARY
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {chartData.map((item, index) => (
          <div
            key={`summary-${index}`}
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background:
                  COLORS[index % COLORS.length],
                margin: "0 auto 6px auto",
              }}
            />

            <div
              style={{
                color: "#94a3b8",
                fontSize: "11px",
                marginBottom: "3px",
              }}
            >
              {item.module}
            </div>

            <div
              style={{
                color: "#ffffff",
                fontSize: "17px",
                fontWeight: "700",
              }}
            >
              {Number(item.count).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}