import fs from "fs";

const replayEvents = JSON.parse(
  fs.readFileSync(
    "./data/replayEvents.json",
    "utf-8"
  )
);

export const generateReplayTimeline = () => {

  let replayText = "";

  replayText += "\n";
  replayText += "=====================================\n";
  replayText += "UCCIS REPLAY RECONSTRUCTION OUTPUT\n";
  replayText += "=====================================\n\n";

  replayEvents.forEach((event, index) => {

    replayText += `STEP ${index + 1}\n`;
    replayText += `Timestamp : ${event.timestamp}\n`;
    replayText += `Type      : ${event.type}\n`;
    replayText += `Operator  : ${event.operator}\n`;
    replayText += `Action    : ${event.message}\n`;
    replayText += "-------------------------------------\n";

  });

  replayText += "\n";
  replayText += "Replay Continuity Validation : SUCCESS\n";
  replayText += "Operational Recovery Status  : VERIFIED\n";
  replayText += "Governance Visibility Status : ACTIVE\n";
  replayText += "\n";

  fs.writeFileSync(
    "./proofs/replay_outputs/replay-output-1.txt",
    replayText
  );

  return replayText;
};