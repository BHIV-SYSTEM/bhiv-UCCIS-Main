const { task33DB } = require("../config/db");

exports.createEvidence = async (
  traceId,
  origin,
  payload
) => {

  const [result] = await task33DB.query(
    `
    INSERT INTO runtime_evidence
    (
      trace_id,
      origin,
      payload,
      status
    )
    VALUES (?,?,?,?)
    `,
    [
      traceId,
      origin,
      JSON.stringify(payload),
      "ACTIVE"
    ]
  );

  return {
    evidenceId: result.insertId,
    traceId
  };
};

exports.getEvidence = async () => {

  const [rows] = await task33DB.query(`
    SELECT *
    FROM runtime_evidence
    ORDER BY created_at DESC
  `);

  return rows;
};

exports.getEvidenceByTrace = async (
  traceId
) => {

  const [rows] = await task33DB.query(
    `
    SELECT *
    FROM runtime_evidence
    WHERE trace_id=?
    ORDER BY created_at DESC
    `,
    [traceId]
  );

  return rows;
};

exports.archiveEvidence = async (
  evidenceId
) => {

  await task33DB.query(
    `
    UPDATE runtime_evidence
    SET status='ARCHIVED'
    WHERE evidence_id=?
    `,
    [evidenceId]
  );
};