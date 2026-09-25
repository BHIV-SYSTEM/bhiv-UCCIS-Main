const fetch = require("node-fetch");

async function validateReplay() {

  const res = await fetch(
    "http://localhost:5000/api/replay"
  );

  const data = await res.json();

  console.log("Replay Validation");
  console.log(data);

}

validateReplay();