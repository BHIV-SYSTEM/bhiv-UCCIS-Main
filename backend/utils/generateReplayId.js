const generateReplayId = () => {
  return (
    "REP-" +
    Date.now() +
    "-" +
    Math.floor(
      Math.random() * 1000
    )
  );
};

module.exports =
  generateReplayId;