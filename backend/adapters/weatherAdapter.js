// adapters/weatherAdapter.js

class WeatherAdapter {

  fetch() {

    return {

      source:
        "weather_api",

      rainfall_mm:
        140,

      storm_probability:
        88,

      timestamp:
        Date.now()
    };
  }
}

module.exports =
  new WeatherAdapter();