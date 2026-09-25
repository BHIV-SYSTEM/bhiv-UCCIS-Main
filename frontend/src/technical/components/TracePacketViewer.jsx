// src/technical/components/TracePacketViewer.jsx

import React from "react";

export default function TracePacketViewer({
  packets
}) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-4">
        Trace Packets
      </h2>

      <div className="space-y-4">

        {packets.map((p, i) => (

          <div
            key={i}
            className="border p-4 rounded-xl"
          >

            <p>
              Trace:
              {p.traceId}
            </p>

            <p>
              Node:
              {p.replayNode}
            </p>

            <p>
              Sequence:
              {p.packetSequence}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}