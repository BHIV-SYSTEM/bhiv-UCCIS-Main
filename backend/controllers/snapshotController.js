const store = require("../storage/snapshotStore");

exports.getAllSnapshots = (req, res) => {
  res.json(store.getAllSnapshots());
};

exports.getSnapshotByTrace = (req, res) => {
  const trace_id = req.params.trace_id;

  const snapshot = store.getSnapshotByTrace(trace_id);

  if (!snapshot) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(snapshot);
};