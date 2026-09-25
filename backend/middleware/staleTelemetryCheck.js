const staleTelemetryCheck = (
  data
) => {

  const now = Date.now();

  return data.map((item) => {

    const age =
      now - item.timestamp;

    return {

      ...item,

      stale:
        age > 300000

    };

  });

};

module.exports =
  staleTelemetryCheck;