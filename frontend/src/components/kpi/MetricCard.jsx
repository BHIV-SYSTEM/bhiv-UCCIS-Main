import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MetricCard({ title, value, status }) {
  const borderColor =
    status === "danger"
      ? "border-red-500"
      : status === "warn"
      ? "border-yellow-500"
      : status === "good"
      ? "border-green-500"
      : "border-blue-500";

  return (
    <Card className={`bg-[#0b1220] border ${borderColor}`}>
      <CardHeader className="p-3 pb-0">
        <p className="text-xs text-gray-400">{title}</p>
      </CardHeader>

      <CardContent className="p-3 pt-1">
        <div className="text-xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}