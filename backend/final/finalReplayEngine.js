import fs from "fs";

export const runFinalReplay = () => {

  const raw = fs.readFileSync(
    "./final/finalLifecycle.json",
    "utf-8"
  );

  const events = JSON.parse(raw);

  let output = "";

  output += "=====================================\n";
  output += "FINAL OPERATIONAL REPLAY DEMONSTRATION\n";
  output += "=====================================\n\n";

  events.forEach((e, i) => {

    output += `STEP ${i + 1}\n`;
    output += `Timestamp : ${e.timestamp}\n`;
    output += `Stage     : ${e.stage}\n`;
    output += `Message   : ${e.message}\n`;
    output += "-------------------------------------\n";

  });

  fs.writeFileSync(
    "./proofs/final_phase10/final-replay-output.txt",
    output
  );

  return output;
};