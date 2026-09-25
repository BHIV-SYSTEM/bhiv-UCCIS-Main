class StateStore {
  constructor() {
    this.store = {};
  }

  init(zoneId) {
    if (!this.store[zoneId]) {
      this.store[zoneId] = [];
    }
  }

  save(zoneId, state) {
    this.init(zoneId);
    this.store[zoneId].push(state);
  }

  getAll(zoneId) {
    this.init(zoneId);
    return this.store[zoneId];
  }

  getLast(zoneId) {
    this.init(zoneId);
    const arr = this.store[zoneId];
    return arr.length ? arr[arr.length - 1] : null;
  }
}

module.exports = new StateStore();