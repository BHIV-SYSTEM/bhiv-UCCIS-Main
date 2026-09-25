const fetch = require("node-fetch");

async function validateConcurrency() {

  for (let i = 0; i < 5; i++) {

    await fetch(
      "http://localhost:5000/api/signal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          operator: i
        })
      }
    );

  }

  console.log(
    "Concurrent Operator Simulation Complete"
  );

}

validateConcurrency();