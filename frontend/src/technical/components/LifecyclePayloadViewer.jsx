import React from "react";

export default function LifecyclePayloadViewer({
  payloads = []
}) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Lifecycle Payloads
      </h2>

      <div className="space-y-4">

        {payloads.map((payload, index) => (

          <div
            key={index}
            className="border rounded-xl p-4"
          >

            <div className="flex justify-between items-center">

              <h3 className="text-lg font-semibold">
                {payload.lifecycle}
              </h3>

              <span
                className={
                  payload.status === "SUCCESS"
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {payload.status}
              </span>

            </div>

            <div className="mt-3 text-gray-700 space-y-1">

              <p>
                <strong>Payload ID:</strong>{" "}
                {payload.id}
              </p>

              <p>
                <strong>Timestamp:</strong>{" "}
                {payload.timestamp}
              </p>

              <p>
                <strong>Replay Node:</strong>{" "}
                {payload.node}
              </p>

              <p>
                <strong>Execution Phase:</strong>{" "}
                {payload.phase}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}