// src/governance/components/reliability/RetryStatusCard.jsx

import React from "react";

export default function RetryStatusCard({
  retry
}) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-xl font-bold mb-4">
        Retry Visibility
      </h2>

      <p>
        Retries:
        {retry.retries}
      </p>

      <p>
        Status:
        {retry.status}
      </p>

    </div>

  );

}