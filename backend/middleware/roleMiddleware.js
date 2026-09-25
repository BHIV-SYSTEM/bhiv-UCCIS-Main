function roleMiddleware(role) {

  return (req, res, next) => {

    const userRole =
      req.headers.role;

    if (userRole !== role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    next();
  };
}

module.exports = roleMiddleware;