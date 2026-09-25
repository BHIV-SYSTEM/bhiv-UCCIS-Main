const errorHandler = (
  err,
  req,
  res,
  next
) => {

  console.error(err);

  res.status(500).json({

    success: false,

    runtime: "degraded",

    message:
      "Operational runtime failure",

    timestamp:
      new Date().toISOString()

  });

};

module.exports = errorHandler;