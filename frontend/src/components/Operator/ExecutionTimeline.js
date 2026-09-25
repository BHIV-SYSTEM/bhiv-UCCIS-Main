import React from "react";

function ExecutionTimeline({ lifecycle }) {

  return (

    <div className="bg-white p-4 rounded shadow">

      <h2>Execution Timeline</h2>

      {
        lifecycle.map((item, index) => (

          <div key={index}>

            <p>
              {
                item.execution_contract
                .requested_action
              }
            </p>

            <p>
              {
                item.execution_contract
                .governance_state
              }
            </p>

          </div>
        ))
      }

    </div>
  );
}

export default ExecutionTimeline;