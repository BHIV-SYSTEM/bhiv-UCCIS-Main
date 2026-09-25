// adapters/floodingAdapter.js

class FloodingAdapter {

  fetch() {

    return {

      source:
        "flooding_feed",

      flood_risk:
        95,

      water_level:
        "CRITICAL",

      timestamp:
        Date.now()
    };
  }
}

module.exports =
  new FloodingAdapter();