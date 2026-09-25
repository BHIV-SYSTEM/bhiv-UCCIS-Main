const { task33DB } = require("../config/db");

const runtimeAudit = (req, res, next) => {

  const startTime = Date.now();

  const originalJson = res.json.bind(res);

  res.json = async (body) => {

    try {

      const responseTime =
        Date.now() - startTime;

      await task33DB.query(
        `
        INSERT INTO runtime_audit
        (
          trace_id,
          endpoint,
          method,
          status_code,
          response_time
        )
        VALUES (?,?,?,?,?)
        `,
        [
          req.traceId || null,
          req.originalUrl,
          req.method,
          res.statusCode,
          responseTime
        ]
      );

    } catch (error) {

      console.log(
        "Runtime Audit Warning:",
        error.message
      );

    }

    return originalJson(body);
  };

  next();
};

module.exports = runtimeAudit;