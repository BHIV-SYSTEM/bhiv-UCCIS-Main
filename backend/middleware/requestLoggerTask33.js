const requestLoggerTask33 = (
  req,
  res,
  next
) => {

  const startTime = Date.now();

  console.log(
    `[${new Date().toISOString()}]`,
    req.method,
    req.originalUrl
  );

  res.on("finish", () => {

    const duration =
      Date.now() - startTime;

    console.log(
      `${req.method} ${req.originalUrl}`,
      `${res.statusCode}`,
      `${duration}ms`
    );

  });

  next();
};

module.exports = requestLoggerTask33;