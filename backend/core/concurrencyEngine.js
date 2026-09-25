const { emit } = require("./eventBus");

function simulateConcurrentOperators() {

  let outputs = [];

  for (let i = 0; i < 5; i++) {
    outputs.push(
      emit("SIGNAL", {
        operator: "operator_" + i,
        concurrent: true
      })
    );
  }

  return outputs;
}

module.exports = {
  simulateConcurrentOperators
};