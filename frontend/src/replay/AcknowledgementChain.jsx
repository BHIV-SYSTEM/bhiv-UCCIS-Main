export default function AcknowledgementChain() {

  const chain = [
    "Field Officer",
    "District Controller",
    "OSD",
    "PS Office",
    "Minister Dashboard"
  ];

  return (

    <div className="ackCard">

      <div className="timelineHeader">
        Acknowledgement Chain
      </div>

      <div className="ackGrid">

        {chain.map((item, index) => (

          <div
            className="ackNode"
            key={index}
          >

            {item}

          </div>

        ))}

      </div>

    </div>
  );
}