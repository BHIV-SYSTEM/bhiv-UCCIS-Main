import fs from "fs";

export const runObservabilityInspector = () => {

  const raw = fs.readFileSync(
    "./stability/operatorNodes.json",
    "utf-8"
  );

  const nodes = JSON.parse(raw);

  let log = "";

  log += "=====================================\n";
  log += "DISTRIBUTED OBSERVABILITY INSPECTOR\n";
  log += "=====================================\n\n";

  nodes.forEach((n, i) => {

    log += `NODE ${i + 1}\n`;
    log += `Operator : ${n.node}\n`;
    log += `View     : ${n.view}\n`;
    log += `Latency  : ${n.latency_ms}ms\n`;
    log += "-------------------------------------\n";

  });

  fs.writeFileSync(
    "./proofs/stability_phase7/inspector-stability-log.txt",
    log
  );

  return nodes;
};