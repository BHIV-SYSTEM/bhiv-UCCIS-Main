function HeatMap() {

  const rows = [1,2,3,4];

  return (

    <div style={panel}>

      <h2>
        Escalation Matrix
      </h2>

      <div style={grid}>

        {rows.map((item) => (

          <div
            key={item}
            style={cell}
          >
            {Math.floor(
              Math.random() * 100
            )}
          </div>

        ))}

      </div>

    </div>

  );

}

const panel = {

  background: "#102030",

  padding: "20px",

  borderRadius: "12px",

  border: "1px solid #1f3b57"
};

const grid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(4,1fr)",

  gap: "10px"
};

const cell = {

  background: "#1e293b",

  padding: "25px",

  borderRadius: "8px",

  textAlign: "center",

  color: "#22c55e"
};

export default HeatMap;