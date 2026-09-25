function calculate(history) {
  if (!history || history.length < 2) return 0;

  const first = history[0];
  const last = history[history.length - 1];

  return last.timestamp - first.timestamp;
}

module.exports = { calculate };