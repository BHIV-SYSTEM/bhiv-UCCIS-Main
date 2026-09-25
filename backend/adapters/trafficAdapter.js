// adapters/trafficAdapter.js

class TrafficAdapter {

  fetch() {

    return {

      source:
        "traffic_api",

      congestion_index:
        82,

      accident_reports:
        14,

      timestamp:
        Date.now()
    };
  }
}

module.exports =
  new TrafficAdapter();