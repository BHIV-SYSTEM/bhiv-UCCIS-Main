function FooterActions() {

  return (

    <div style={container}>

      <button style={button}>
        Generate Replay
      </button>

      <button style={button}>
        Recovery Audit
      </button>

      <button style={button}>
        Runtime Validation
      </button>

      <button style={button}>
        Export Evidence
      </button>

    </div>

  );

}

const container = {

  display: "flex",

  gap: "20px",

  marginTop: "30px"
};

const button = {

  background: "#102030",

  border: "1px solid #1f3b57",

  color: "white",

  padding: "14px 20px",

  borderRadius: "10px",

  cursor: "pointer"
};

export default FooterActions;