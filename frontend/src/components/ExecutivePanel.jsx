function ExecutivePanel() {

  return (

    <div style={panel}>

      <h2>
        Executive Summary
      </h2>

      <p>
        Replay Infrastructure:
        ACTIVE
      </p>

      <p>
        Governance Visibility:
        VERIFIED
      </p>

      <p>
        Runtime Proof Layer:
        ACTIVE
      </p>

      <p>
        Recovery Sequencing:
        OPERATIONAL
      </p>

      <p>
        Audit Continuity:
        VERIFIED
      </p>

    </div>

  );

}

const panel = {

  background: "#102030",

  padding: "20px",

  borderRadius: "12px",

  border: "1px solid #1f3b57",

  color: "white"
};

export default ExecutivePanel;