import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { time: "10:00", incidents: 4 },
  { time: "10:15", incidents: 7 },
  { time: "10:30", incidents: 5 },
  { time: "10:45", incidents: 9 },
  { time: "11:00", incidents: 6 },
  { time: "11:15", incidents: 3 }
];

export default function ReplayTimeline() {
  return (
    <div className="bg-[#0b1220] border border-[#1f2a44] rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3">
        Operational Replay Timeline
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid stroke="#1f2a44" />
          <XAxis dataKey="time" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line type="monotone" dataKey="incidents" stroke="#4da3ff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}