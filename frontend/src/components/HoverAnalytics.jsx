import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function HoverAnalytics({
  type
}) {

  let data = [];

  if (type === "replay") {

    data = [
      {
        phase: "P1",
        value: 10
      },

      {
        phase: "P2",
        value: 18
      },

      {
        phase: "P3",
        value: 30
      },

      {
        phase: "P4",
        value: 45
      },

      {
        phase: "P5",
        value: 60
      },

      {
        phase: "P6",
        value: 75
      },

      {
        phase: "P7",
        value: 90
      }
    ];
  }

  if (type === "lifecycle") {

    data = [
      {
        phase: "SIGNAL",
        value: 100
      },

      {
        phase: "INTELLIGENCE",
        value: 92
      },

      {
        phase: "ESCALATION",
        value: 88
      },

      {
        phase: "GOVERNANCE",
        value: 80
      },

      {
        phase: "ENFORCEMENT",
        value: 72
      },

      {
        phase: "RECOVERY",
        value: 94
      }
    ];
  }

  if (type === "failure") {

    data = [
      {
        phase: "Detected",
        value: 40
      },

      {
        phase: "Recovered",
        value: 85
      },

      {
        phase: "Pending",
        value: 15
      }
    ];
  }

  if (type === "concurrency") {

    data = [
      {
        phase: "Operator-1",
        value: 20
      },

      {
        phase: "Operator-2",
        value: 35
      },

      {
        phase: "Operator-3",
        value: 27
      },

      {
        phase: "Operator-4",
        value: 42
      }
    ];
  }

  if (type === "dependency") {

    data = [
      {
        phase: "Replay",
        value: 95
      },

      {
        phase: "Lifecycle",
        value: 90
      },

      {
        phase: "Concurrency",
        value: 85
      },

      {
        phase: "Recovery",
        value: 93
      },

      {
        phase: "Observability",
        value: 97
      }
    ];
  }

  return (
    <div className="chart-container">

      <ResponsiveContainer
        width="100%"
        height={200}
      >

        <AreaChart data={data}>

          <XAxis dataKey="phase" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#38bdf8"
            fill="#38bdf8"
            fillOpacity={0.4}
          />

        </AreaChart>

      </ResponsiveContainer>

      <div className="analytics-label">

        Live Operational Analytics

      </div>

    </div>
  );
}