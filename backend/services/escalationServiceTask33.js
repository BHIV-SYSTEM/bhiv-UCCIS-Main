const { task33DB } = require("../config/db");

exports.createEscalation = async (
  traceId,
  incident
) => {

  const escalationLevel =
    incident.severity === "CRITICAL"
      ? "LEVEL_3"
      : incident.severity === "HIGH"
      ? "LEVEL_2"
      : "LEVEL_1";

  const [result] = await task33DB.query(
    `
    INSERT INTO escalations
    (
      trace_id,
      escalation_level,
      status
    )
    VALUES (?,?,?)
    `,
    [
      traceId,
      escalationLevel,
      "PENDING"
    ]
  );

  return {
    escalationId: result.insertId,
    traceId,
    escalationLevel
  };
};

exports.getEscalations = async () => {

  const [rows] = await task33DB.query(`
    SELECT *
    FROM escalations
    ORDER BY created_at DESC
  `);

  return rows;
};

exports.closeEscalation = async (
  escalationId
) => {

  await task33DB.query(
    `
    UPDATE escalations
    SET status='CLOSED'
    WHERE escalation_id=?
    `,
    [escalationId]
  );
};