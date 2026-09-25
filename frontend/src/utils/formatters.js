/*
=====================================================
DATE FORMATTER
=====================================================
*/

export const formatDate = (
  value
) => {

  if (!value) {
    return "N/A";
  }

  return new Date(
    value
  ).toLocaleString();

};

/*
=====================================================
STATUS FORMATTER
=====================================================
*/

export const formatStatus =
  (status) => {

    if (!status) {
      return "UNKNOWN";
    }

    return status
      .replaceAll("_", " ")
      .toUpperCase();

  };

/*
=====================================================
SEVERITY FORMATTER
=====================================================
*/

export const formatSeverity =
  (severity) => {

    if (!severity) {
      return "LOW";
    }

    return severity
      .charAt(0)
      .toUpperCase() +
      severity
        .slice(1)
        .toLowerCase();

  };

/*
=====================================================
COUNT FORMATTER
=====================================================
*/

export const formatCount =
  (count) => {

    return Number(
      count || 0
    ).toLocaleString();

  };

/*
=====================================================
TRACE FORMATTER
=====================================================
*/

export const formatTraceId =
  (traceId) => {

    if (!traceId) {
      return "NO_TRACE";
    }

    return traceId;

  };

/*
=====================================================
PERCENT FORMATTER
=====================================================
*/

export const formatPercent =
  (value) => {

    return `${value || 0}%`;

  };

/*
=====================================================
JSON FORMATTER
=====================================================
*/

export const formatJson =
  (payload) => {

    try {

      return JSON.stringify(
        JSON.parse(payload),
        null,
        2
      );

    } catch {

      return payload;

    }

  };