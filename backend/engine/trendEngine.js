function detect(current, previous) {
  if (previous === null) return "STABLE";

  if (current > previous) return "UP";
  if (current < previous) return "DOWN";

  return "STABLE";
}

module.exports = { detect };