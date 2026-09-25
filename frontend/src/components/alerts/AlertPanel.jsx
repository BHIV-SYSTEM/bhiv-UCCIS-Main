import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AlertPanel() {
  return (
    <Card className="col-span-5 bg-[#0b1220] border border-[#1f2a44]">

      <CardHeader>
        <h3 className="text-sm font-semibold">Live Alerts</h3>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 text-xs">

          <div className="p-2 rounded bg-[#0f1a2e] border border-red-500/30">
            Infrastructure failure risk detected
          </div>

          <div className="p-2 rounded bg-[#0f1a2e] border border-yellow-500/30">
            Transport escalation pending approval
          </div>

          <div className="p-2 rounded bg-[#0f1a2e] border border-blue-500/30">
            Power grid fluctuation alert
          </div>

        </div>
      </CardContent>

    </Card>
  );
}