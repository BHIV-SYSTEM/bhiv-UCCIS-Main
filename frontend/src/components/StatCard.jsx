function StatCard({

  title,

  value,

  color

}) {

  return (

    <div
      style={{
        background: "#102030",
        padding: "20px",
        borderRadius: "12px",
        border: `1px solid ${color}`,
        color: "white"
      }}
    >

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "10px"
        }}
      >
        {title}
      </p>

      <h1
        style={{
          margin: 0,
          color: color
        }}
      >
        {value}
      </h1>

    </div>

  );

}

export default StatCard;