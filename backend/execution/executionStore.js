const executions = [];

function storeExecution(request) {
  executions.push(request);
}

function getExecutions() {
  return executions;
}

module.exports = {
  storeExecution,
  getExecutions
};