// src/components/governance/AssignmentQueuePanel.jsx

import React from "react";

export default function AssignmentQueuePanel({
  queues
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Assignment Queues
      </h2>

      <div className="space-y-4">

        {queues.map((item, index) => (

          <div
            key={index}
            className="border rounded-xl p-4"
          >

            <h3 className="font-bold">
              {item.department}
            </h3>

            <p>
              Pending Assignments:
              {item.pendingAssignments}
            </p>

            <span className="text-orange-600 font-semibold">
              {item.priority}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}