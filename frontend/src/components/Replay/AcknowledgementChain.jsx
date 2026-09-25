export default function AcknowledgementChain() {

  return (
    <div className="replay-panel">

      <div className="replay-panel-header">
        ACKNOWLEDGEMENT CHAIN
      </div>

      <div className="ack-card">
        Collector → ACK RECEIVED
      </div>

      <div className="ack-card">
        District Ops → ACK RECEIVED
      </div>

      <div className="ack-card pending">
        Field Officer → PENDING
      </div>

    </div>
  );
}