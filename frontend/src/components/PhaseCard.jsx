import {
  Link
} from "react-router-dom";

function PhaseCard({

  title,

  route

}) {

  return (

    <Link
      to={route}
      style={card}
    >
      {title}
    </Link>

  );

}

const card = {

  background: "#102030",

  padding: "40px",

  borderRadius: "12px",

  border: "1px solid #1f3b57",

  textDecoration: "none",

  color: "white",

  fontSize: "22px",

  fontWeight: "bold",

  textAlign: "center",

  display: "block"
};

export default PhaseCard;