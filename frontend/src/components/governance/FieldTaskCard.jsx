// src/components/governance/FieldTaskCard.jsx

import React from "react";

export default function FieldTaskCard({
  task
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold">
          {task.title}
        </h2>

        <span className="bg-red-500 text-white px-4 py-2 rounded-full">
          {task.priority}
        </span>

      </div>

      <div className="mt-6 space-y-3">

        <p>
          <strong>Task ID:</strong>
          {task.taskId}
        </p>

        <p>
          <strong>Location:</strong>
          {task.location}
        </p>

        <p>
          <strong>Assigned Officer:</strong>
          {task.assignedOfficer}
        </p>

      </div>

    </div>
  );
}