module.exports =
(req, res, next) => {

  const {
    signalId
  } = req.body;

  if (!signalId) {

    return res.status(400).json({
      success: false,
      message:
        "signalId required"
    });

  }

  next();
};