const executions = [];

class ExecutionJournal {

  append(data) {

    executions.push(

      Object.freeze({

        ...data,

        journaled_at:
          Date.now()
      })
    );
  }

  getAll() {

    return executions;
  }
}

module.exports =
  new ExecutionJournal();