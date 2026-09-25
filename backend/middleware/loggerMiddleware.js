const loggerMiddleware = (req, res, next) => {
  console.log("=================================");
  console.log("Method :", req.method);
  console.log("URL :", req.originalUrl);
  console.log("Time :", new Date().toISOString());
  console.log("=================================");

  next();
};

module.exports = loggerMiddleware;