// data_ingestion/ingestionPipeline.js

const weatherAdapter =
  require("../adapters/weatherAdapter");

const floodingAdapter =
  require("../adapters/floodingAdapter");

const trafficAdapter =
  require("../adapters/trafficAdapter");

const complaintsAdapter =
  require("../adapters/complaintsAdapter");

const tantraNormalizer =
  require("../normalizers/tantraNormalizer");

class IngestionPipeline {

  execute() {

    // =====================================
    // RAW UPSTREAM DATA
    // =====================================

    const weather =
      weatherAdapter.fetch();

    const flooding =
      floodingAdapter.fetch();

    const traffic =
      trafficAdapter.fetch();

    const complaints =
      complaintsAdapter.fetch();

    // =====================================
    // RAW SIGNALS
    // =====================================

    const rawSignals = {

      weather,

      flooding,

      traffic,

      complaints
    };

    // =====================================
    // TANTRA NORMALIZATION
    // =====================================

    const structuredSignals =
      tantraNormalizer.normalize(
        rawSignals
      );

    // =====================================
    // PIPELINE OUTPUT
    // =====================================

    return {

      pipeline_status:
        "SUCCESS",

      raw_data:
        rawSignals,

      tantra_signals:
        structuredSignals,

      ingested_at:
        Date.now()
    };
  }
}

module.exports =
  new IngestionPipeline();