module.exports =
(req, res, next) => {

  const {
    replayId,
    traceId
  } = req.body;

  if (!replayId) {

    return res.status(400).json({
      success: false,
      message:
        "replayId required"
    });

  }

  if (!traceId) {

    return res.status(400).json({
      success: false,
      message:
        "traceId required"
    });

  }

  next();
};