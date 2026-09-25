function normalizeAll(data) {
  return data.map((d, i) => ({
    trace_id: "TR_" + i,
    zone_id: d.zone,
    domain: d.type,
    value: d.value,
    severity: d.value > 70 ? "HIGH" : d.value > 40 ? "MEDIUM" : "LOW",
    timestamp: d.timestamp,
    source: d.source,
  }));
}

module.exports = { normalizeAll };