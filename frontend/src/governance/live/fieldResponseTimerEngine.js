// src/governance/live/fieldResponseTimerEngine.js

export function fieldResponseTimerEngine(
  tasks = []
) {

  return tasks.map((t) => ({

    task: t.name,

    district: t.district,

    elapsedMinutes: t.elapsed || 0,

    etaStatus:

      t.elapsed > t.eta
        ? "DELAYED"
        : "ON TRACK",

    remaining:

      Math.max(
        0,
        t.eta - t.elapsed
      )

  }));
}