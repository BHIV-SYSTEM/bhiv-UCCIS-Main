const loggerTask36 =
  (req, res, next) => {
    console.log(
      `[${new Date().toISOString()}]`,
      req.method,
      req.originalUrl
    );

    next();
  };

module.exports = loggerTask36;