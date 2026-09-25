const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      "uccis_secret"
    );

    req.user = decoded;

    next();

  } catch {

    res.status(401).json({
      error: "Invalid Token"
    });
  }

};