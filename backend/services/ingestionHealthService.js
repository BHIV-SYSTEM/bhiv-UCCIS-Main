function getIngestionHealth() {
  return {
    ingestion_pipeline: "ACTIVE",
    dropped_packets: 0,
    stale_ingestion: false,
    replay_safe: true
  };
}

module.exports = {
  getIngestionHealth
};