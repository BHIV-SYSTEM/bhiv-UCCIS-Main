const fs =
  require("fs");

const path =
  require("path");

const auditFile =
  path.join(

    __dirname,

    "../audit/auditLog.json"
  );

class AuditEngine {

  // =====================================
  // READ AUDIT FILE
  // =====================================

  readAuditFile() {

    try {

      const data =
        fs.readFileSync(

          auditFile,

          "utf8"
        );

      return JSON.parse(data);

    } catch {

      return [];
    }
  }

  // =====================================
  // WRITE AUDIT FILE
  // =====================================

  writeAuditFile(data) {

    fs.writeFileSync(

      auditFile,

      JSON.stringify(
        data,
        null,
        2
      )
    );
  }

  // =====================================
  // APPEND IMMUTABLE SNAPSHOT
  // =====================================

  persist(snapshot) {

    const auditHistory =
      this.readAuditFile();

    // IMMUTABLE OBJECT
    const immutableSnapshot =
      Object.freeze({

        ...snapshot,

        persisted_at:
          Date.now()
      });

    // APPEND ONLY
    auditHistory.push(
      immutableSnapshot
    );

    this.writeAuditFile(
      auditHistory
    );
  }

  // =====================================
  // GET FULL AUDIT HISTORY
  // =====================================

  getAuditHistory() {

    return this.readAuditFile();
  }

  // =====================================
  // GET TRACE LINEAGE
  // =====================================

  getLineage(zoneId) {

    const auditHistory =
      this.readAuditFile();

    return auditHistory

      .filter(item =>

        item.zone_id ==
        zoneId
      )

      .map(item => ({

        trace_id:
          item.trace_id,

        timestamp:
          item.timestamp,

        final_level:
          item.final_level
      }));
  }

  // =====================================
  // GET EXECUTION JOURNAL
  // =====================================

  getExecutions() {

    const auditHistory =
      this.readAuditFile();

    return auditHistory.map(
      item => ({

        trace_id:
          item.trace_id,

        governance:
          item.governance_response,

        anomalies:
          item.anomalies,

        propagation:
          item.cluster_intelligence
      })
    );
  }
}

module.exports =
  new AuditEngine();