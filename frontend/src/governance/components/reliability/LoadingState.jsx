// src/governance/components/reliability/LoadingState.jsx

import React from "react";

export default function LoadingState({
  loading
}) {

  if (!loading.loading) {
    return null;
  }

  return (

    <div className="bg-blue-100 p-4 rounded-xl">

      <div className="animate-pulse">

        <h2 className="font-bold text-blue-800">
          Loading
        </h2>

        <p>
          {loading.message}
        </p>

      </div>

    </div>

  );

}