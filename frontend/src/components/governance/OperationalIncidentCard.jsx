// src/components/governance/OperationalIncidentCard.jsx

import React from "react";

export default function OperationalIncidentCard({
  incident
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border">

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {incident.title}
        </h2>

        <span
          className={`px-4 py-2 rounded-full text-white ${
            incident.severity === "Critical"
              ? "bg-red-600"
              : incident.severity === "High"
              ? "bg-orange-500"
              : "bg-yellow-500"
          }`}
        >
          {incident.severity}
        </span>
      </div>

      <div className="mt-4 space-y-2">

        <p>
          <strong>District:</strong>{" "}
          {incident.district}
        </p>

        <p>
          <strong>Operational Impact:</strong>{" "}
          {incident.operationalImpact}
        </p>

        <p>
          <strong>Citizen Risk:</strong>{" "}
          {incident.citizenRisk}
        </p>

        <p>
          <strong>Recommended Action:</strong>{" "}
          {incident.recommendedAction}
        </p>

        <p>
          <strong>Assigned Authority:</strong>{" "}
          {incident.escalationOwner}
        </p>

      </div>

    </div>
  );
}