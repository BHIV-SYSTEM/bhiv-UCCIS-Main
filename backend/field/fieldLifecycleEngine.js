import fs from "fs";

export const runFieldLifecycle = () => {

  const raw = fs.readFileSync(
    "./field/fieldEvents.json",
    "utf-8"
  );

  const events = JSON.parse(raw);

  let log = "";

  log += "=====================================\n";
  log += "FIELD LIFECYCLE CONTINUITY LOG\n";
  log += "=====================================\n\n";

  events.forEach((e, i) => {

    log += `STEP ${i + 1}\n`;
    log += `Timestamp : ${e.timestamp}\n`;
    log += `Stage     : ${e.stage}\n`;
    log += `Message   : ${e.message}\n`;
    log += "-------------------------------------\n";

  });

  fs.writeFileSync(
    "./proofs/field_phase6/lifecycle-log.txt",
    log
  );

  return log;
};