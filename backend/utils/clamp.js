function clamp(value, min = 0, max = 100) {
  if (value == null || isNaN(value)) return 0;
  return Math.max(min, Math.min(max, value));
}

module.exports = clamp;