const db = require("../config/db");

const runtimeHealthCheck =
  async (
    req,
    res,
    next
  ) => {

    try {

      await db.promise().query(
        "SELECT 1"
      );

      req.runtimeHealth = {
        backend: "UP",
        database: "CONNECTED"
      };

      next();

    } catch (error) {

      return res.status(500).json({
        success: false,
        backend: "UP",
        database: "DOWN",
        error:
          "Database connection failed"
      });

    }
  };

module.exports =
  runtimeHealthCheck;