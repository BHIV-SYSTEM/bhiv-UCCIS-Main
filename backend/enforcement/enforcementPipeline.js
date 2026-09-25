import fs from "fs";

export const runEnforcementPipeline = () => {

  const raw = fs.readFileSync(
    "./enforcement/enforcementEvents.json",
    "utf-8"
  );

  const events = JSON.parse(raw);

  let log = "";

  log += "=====================================\n";
  log += "ENFORCEMENT-LINKED CONTINUITY LOG\n";
  log += "=====================================\n\n";

  events.forEach((e, i) => {

    log += `STEP ${i + 1}\n`;
    log += `Timestamp : ${e.timestamp}\n`;
    log += `Stage     : ${e.stage}\n`;
    log += `Message   : ${e.message}\n`;
    log += "-------------------------------------\n";

  });

  fs.writeFileSync(
    "./proofs/enforcement_phase5/continuity-log.txt",
    log
  );

  return log;
};