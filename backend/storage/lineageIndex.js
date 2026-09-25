const lineage = {};

class LineageIndex {

  append(zoneId, traceId) {

    if (!lineage[zoneId]) {

      lineage[zoneId] = [];
    }

    lineage[zoneId].push({

      trace_id:
        traceId,

      indexed_at:
        Date.now()
    });
  }

  get(zoneId) {

    return lineage[zoneId] || [];
  }
}

module.exports =
  new LineageIndex();