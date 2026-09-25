function TraceChain({
  trace
}) {
  return (
    <div className="trace-chain">

      <div>
        Signal
      </div>

      <div>↓</div>

      <div>
        Telemetry
      </div>

      <div>↓</div>

      <div>
        Incident
      </div>

      <div>↓</div>

      <div>
        Escalation
      </div>

      <div>↓</div>

      <div>
        Replay
      </div>

      <div>↓</div>

      <div>
        Evidence
      </div>

      <br />

      <strong>
        {trace}
      </strong>

    </div>
  );
}

export default TraceChain;