function isSessionStale(
  lastHeartbeat,
  threshold = 30000
) {
  return (
    Date.now() - new Date(lastHeartbeat).getTime()
    > threshold
  );
}

module.exports = {
  isSessionStale
};