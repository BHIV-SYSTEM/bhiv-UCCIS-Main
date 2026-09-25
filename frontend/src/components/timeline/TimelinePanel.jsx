import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TimelinePanel() {
  return (
    <div className="col-span-5 bg-[#0b1220] border border-[#1f2a44] rounded-xl p-3">

      <h3 className="text-sm font-semibold mb-2">
        Operational Timeline
      </h3>

      <Tabs defaultValue="live" className="w-full">

        <TabsList className="bg-[#0f1a2e]">
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-2 text-xs text-gray-300">
          Live operational events streaming...
        </TabsContent>

        <TabsContent value="history" className="mt-2 text-xs text-gray-300">
          Historical replay / audit trail...
        </TabsContent>

      </Tabs>

    </div>
  );
}