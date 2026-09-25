// src/components/governance/EscalationContactCard.jsx

import React from "react";

export default function EscalationContactCard({
  contact
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        Escalation Contact
      </h2>

      <p className="text-lg">
        {contact}
      </p>

    </div>
  );
}