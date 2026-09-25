function detectCollision(
  existing,
  incoming
) {
  return (
    existing.trace_id === incoming.trace_id &&
    existing.state === incoming.state &&
    existing.operator_id !== incoming.operator_id
  );
}

module.exports = {
  detectCollision
};