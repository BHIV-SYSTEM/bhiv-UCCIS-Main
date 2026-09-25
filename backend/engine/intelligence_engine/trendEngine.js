function detectTrend(current, previous) {

  if (!previous) {
    return "STABLE";
  }

  const delta = current - previous;

  if (delta >= 20) {
    return "SHARPLY_RISING";
  }

  if (delta >= 10) {
    return "RISING";
  }

  if (delta <= -20) {
    return "SHARPLY_FALLING";
  }

  if (delta <= -10) {
    return "FALLING";
  }

  return "STABLE";
}

module.exports = detectTrend;