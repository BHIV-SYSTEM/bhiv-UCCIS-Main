// adapters/complaintsAdapter.js

class ComplaintsAdapter {

  fetch() {

    return {

      source:
        "civic_dataset",

      complaint_volume:
        420,

      emergency_complaints:
        120,

      timestamp:
        Date.now()
    };
  }
}

module.exports =
  new ComplaintsAdapter();