import fs from "fs";

const corruptionEvents = JSON.parse(
  fs.readFileSync(
    "./corruption/corruptionEvents.json",
    "utf-8"
  )
);

export const simulateCorruption = () => {

  let output = "";

  output += "\n";
  output += "=====================================\n";
  output += "REPLAY CORRUPTION SIMULATION\n";
  output += "=====================================\n\n";

  corruptionEvents.forEach((event, index) => {

    output += `EVENT ${index + 1}\n`;
    output += `Timestamp : ${event.timestamp}\n`;
    output += `Type      : ${event.type}\n`;
    output += `Message   : ${event.message}\n`;
    output += "-------------------------------------\n";

  });

  fs.writeFileSync(
    "./proofs/corruption_logs/replay-corruption-log.txt",
    output
  );

  return output;
};