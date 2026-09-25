function TraceChainTask34() {
  const layers = [
    "Signal",
    "Telemetry",
    "Incident",
    "Escalation",
    "Replay",
    "Evidence"
  ];

  return (
    <div className="trace-chain">
      <h3>Trace Chain</h3>

      <div className="trace-flow">
        {layers.map(
          (layer, index) => (
            <div
              key={layer}
              className="trace-step"
            >
              <span>
                {layer}
              </span>

              {index <
                layers.length -
                  1 && (
                <span>
                  →
                </span>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default TraceChainTask34;