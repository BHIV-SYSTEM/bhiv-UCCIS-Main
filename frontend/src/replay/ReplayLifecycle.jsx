export default function ReplayLifecycle() {

  const lifecycle = [
    "Trigger",
    "Acknowledgement",
    "Escalation",
    "Recovery",
    "Validation",
    "Reconstruction"
  ];

  return (

    <div className="lifecycleCard">

      <div className="timelineHeader">
        Lifecycle Visualization
      </div>

      <div className="lifecycleGrid">

        {lifecycle.map((item, index) => (

          <div
            className="lifecycleNode"
            key={index}
          >

            {item}

          </div>

        ))}

      </div>

    </div>
  );
}