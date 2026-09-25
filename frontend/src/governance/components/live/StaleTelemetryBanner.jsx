export default function StaleTelemetryBanner({ feeds }) {

  return (
    <div className="bg-red-100 p-4 rounded-xl">

      <h2 className="font-bold">
        Telemetry Health
      </h2>

      {feeds.map((f, i) => (
        <div key={i}>
          {f.source} → {f.status}
        </div>
      ))}

    </div>
  );
}