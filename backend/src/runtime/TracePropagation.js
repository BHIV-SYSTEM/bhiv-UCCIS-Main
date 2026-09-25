const { v4: uuidv4 } =
  require("uuid");

class TracePropagation {

  generateTraceId() {

    return uuidv4();

  }

}

module.exports =
  new TracePropagation();