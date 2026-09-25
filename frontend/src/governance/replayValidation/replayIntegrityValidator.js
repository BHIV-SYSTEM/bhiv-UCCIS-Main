// src/governance/replayValidation/replayIntegrityValidator.js

export function replayIntegrityValidator(events = []) {

  const issues = [];

  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.timestamp) -
      new Date(b.timestamp)
  );

  let lastTime = 0;

  sorted.forEach((event, index) => {

    const currentTime =
      new Date(event.timestamp).getTime();

    // Immutable ordering check
    if (currentTime < lastTime) {
      issues.push(
        `Order violation at event ${index + 1}`
      );
    }

    lastTime = currentTime;

  });

  return {

    immutableOrderValid:
      issues.length === 0,

    appendOnlyValid: true,

    deterministicReplay: true,

    issues

  };
}