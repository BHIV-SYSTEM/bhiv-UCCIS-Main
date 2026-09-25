const loggerTask37 = (req, res, next) => {
  const now = new Date().toISOString();

  console.log(
    `[${now}] ${req.method} ${req.originalUrl}`
  );

  next();
};

module.exports = loggerTask37;