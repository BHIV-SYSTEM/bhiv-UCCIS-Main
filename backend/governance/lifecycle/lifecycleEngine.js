const buildExecutionContract =
require("./executionContractBuilder");

const immutableAuditWriter =
require("./immutableAuditWriter");

const replayIndexer =
require("./replayIndexer");

function processLifecycle(action) {

  const contract =
    buildExecutionContract(action);

  const auditPath =
    immutableAuditWriter(contract);

  const replayPath =
    replayIndexer(contract);

  return {

    execution_contract:
      contract,

    audit_log:
      auditPath,

    replay_record:
      replayPath
  };
}

module.exports =
processLifecycle;