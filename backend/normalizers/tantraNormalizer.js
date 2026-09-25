// normalizers/tantraNormalizer.js

class TantraNormalizer {

  normalize(rawSignals) {

    return {

      traffic: {

        score:
          rawSignals.traffic
            .congestion_index,

        level:
          this.calculateLevel(
            rawSignals.traffic
              .congestion_index
          )
      },

      flooding: {

        score:
          rawSignals.flooding
            .flood_risk,

        level:
          this.calculateLevel(
            rawSignals.flooding
              .flood_risk
          )
      },

      complaints: {

        score:
          rawSignals.complaints
            .emergency_complaints,

        level:
          this.calculateLevel(
            rawSignals.complaints
              .emergency_complaints
          )
      },

      weather_signal: {

        rainfall_mm:
          rawSignals.weather
            .rainfall_mm,

        storm_probability:
          rawSignals.weather
            .storm_probability
      }
    };
  }

  calculateLevel(score) {

    if (score >= 80) {

      return "HIGH";
    }

    if (score >= 50) {

      return "MEDIUM";
    }

    return "LOW";
  }
}

module.exports =
  new TantraNormalizer();