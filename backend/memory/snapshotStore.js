const snapshots = [];

function saveSnapshot(data) {
  snapshots.push(data);
}

module.exports = { snapshots, saveSnapshot };