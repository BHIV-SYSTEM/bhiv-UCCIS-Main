const fs = require("fs");

const concurrentEvents = JSON.parse(
  fs.readFileSync(
    "./concurrent/concurrentEvents.json",
    "utf8"
  )
);

const runConcurrentSimulation = () => {

  let simulationOutput = "";

  simulationOutput += "\n";
  simulationOutput += "=====================================\n";
  simulationOutput += "CONCURRENT OPERATOR SIMULATION\n";
  simulationOutput += "=====================================\n\n";

  concurrentEvents.forEach((event, index) => {

    simulationOutput += `EVENT ${index + 1}\n`;
    simulationOutput += `Timestamp : ${event.timestamp}\n`;
    simulationOutput += `Operator  : ${event.operator}\n`;
    simulationOutput += `Type      : ${event.type}\n`;
    simulationOutput += `Message   : ${event.message}\n`;
    simulationOutput += "-------------------------------------\n";

  });

  fs.writeFileSync(
    "./proofs/collision_logs/collision-log.txt",
    simulationOutput
  );

  return simulationOutput;

};

module.exports = {
  runConcurrentSimulation,
};