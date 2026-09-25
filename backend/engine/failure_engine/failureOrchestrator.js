const buildStructuredError =
require("./structuredErrorBuilder");

const detectStaleSignal =
require("./staleSignalDetector");

const detectDuplicate =
require("./duplicateDetector");

const validateTrace =
require("./traceValidator");

const validatePayload =
require("./payloadValidator");

const writeFailureAudit =
require("./failureAuditWriter");

async function failureOrchestrator(
  payload
) {

  /*
    Payload validation
  */

  const payloadValidation =
    validatePayload(payload);

  if (!payloadValidation.valid) {

    const error =
      buildStructuredError({

        type:
          "PAYLOAD_VALIDATION_FAILURE",

        message:
          payloadValidation.reason,

        trace_id:
          payload.trace_id,

        severity:
          "HIGH",

        source:
          "INGESTION"
      });

    writeFailureAudit(error);

    return error;
  }

  /*
    Trace validation
  */

  if (
    !validateTrace(
      payload.trace_id
    )
  ) {

    const error =
      buildStructuredError({

        type:
          "TRACE_VALIDATION_FAILURE",

        message:
          "INVALID_TRACE_ID",

        trace_id:
          payload.trace_id,

        severity:
          "CRITICAL",

        source:
          "TRACE_ENGINE"
      });

    writeFailureAudit(error);

    return error;
  }

  /*
    Duplicate detection
  */

  if (
    detectDuplicate(
      payload.signal_id
    )
  ) {

    const error =
      buildStructuredError({

        type:
          "DUPLICATE_SIGNAL",

        message:
          "SIGNAL_ALREADY_PROCESSED",

        trace_id:
          payload.trace_id,

        severity:
          "MODERATE",

        source:
          "INGESTION"
      });

    writeFailureAudit(error);

    return error;
  }

  /*
    Stale detection
  */

  if (
    detectStaleSignal(payload)
  ) {

    const error =
      buildStructuredError({

        type:
          "STALE_SIGNAL",

        message:
          "SIGNAL_TOO_OLD",

        trace_id:
          payload.trace_id,

        severity:
          "HIGH",

        source:
          "TEMPORAL_ENGINE"
      });

    writeFailureAudit(error);

    return error;
  }

  return {

    success: true,

    trace_id:
      payload.trace_id,

    message:
      "Failure checks passed"
  };
}

module.exports =
failureOrchestrator;