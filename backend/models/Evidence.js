class Evidence {
  constructor(data) {
    this.id = data.id;
    this.traceId = data.traceId;
    this.fileName = data.fileName;
    this.fileType = data.fileType;
    this.location = data.location;
    this.createdAt = data.createdAt;
  }
}

module.exports = Evidence;