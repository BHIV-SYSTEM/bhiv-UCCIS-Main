import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function RuntimeChart({ data = [] }) {
  // =========================================================
  // NORMALIZE DATA
  // =========================================================

  const normalizedData = Array.isArray(data)
    ? data
        .filter(Boolean)
        .map((item, index) => ({
          module:
            item?.module ||
            item?.service ||
            item?.component ||
            `Module ${index + 1}`,

          count: Number(
            item?.count ??
            item?.total ??
            item?.logs ??
            0
          ),
        }))
        .filter((item) => item.count > 0)
    : [];

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      style={{
        width: "100%",
        height: "330px",
        background: "#111827",
        boxSizing: "border-box",
      }}
    >
      {normalizedData.length > 0 ? (
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={normalizedData}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 25,
            }}
            barCategoryGap="18%"
          >
            {/* =================================================
                GRID
            ================================================= */}

            <CartesianGrid
              stroke="#1e293b"
              strokeDasharray="0"
              vertical={false}
            />

            {/* =================================================
                X AXIS
            ================================================= */}

            <XAxis
              dataKey="module"
              tick={{
                fill: "#6b7280",
                fontSize: 16,
              }}
              axisLine={{
                stroke: "#64748b",
              }}
              tickLine={{
                stroke: "#64748b",
              }}
            />

            {/* =================================================
                Y AXIS
            ================================================= */}

            <YAxis
              allowDecimals={false}
              domain={[0, "auto"]}
              tick={{
                fill: "#6b7280",
                fontSize: 15,
              }}
              axisLine={{
                stroke: "#64748b",
              }}
              tickLine={{
                stroke: "#64748b",
              }}
            />

            {/* =================================================
                TOOLTIP
            ================================================= */}

            <Tooltip
              cursor={{
                fill: "rgba(255,255,255,0.04)",
              }}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#ffffff",
              }}
              labelStyle={{
                color: "#ffffff",
                fontWeight: "600",
                marginBottom: "4px",
              }}
              itemStyle={{
                color: "#ffffff",
              }}
              formatter={(value) => [
                value,
                "Logs",
              ]}
            />

            {/* =================================================
                BAR
            ================================================= */}

            <Bar
              dataKey="count"
              fill="#4f9cf9"
              radius={[0, 0, 0, 0]}
              maxBarSize={540}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748b",
            fontSize: "15px",
          }}
        >
          No runtime log data available
        </div>
      )}
    </div>
  );
}