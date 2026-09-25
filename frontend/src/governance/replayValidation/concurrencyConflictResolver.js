// src/governance/replayValidation/concurrencyConflictResolver.js

export function concurrencyConflictResolver(events = []) {

  const resolvedMap = new Map();

  events.forEach(event => {

    const key =
      `${event.id}-${event.timestamp}`;

    if (!resolvedMap.has(key)) {
      resolvedMap.set(key, event);
    }

  });

  return Array.from(resolvedMap.values());
}