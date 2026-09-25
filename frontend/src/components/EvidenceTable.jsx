import React from "react";

function EvidenceTable({ evidence = [] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Trace ID</th>
          <th>Origin</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {evidence.length > 0 ? (
          evidence.map((item, index) => {
            const traceId =
              item?.trace_id ??
              item?.traceId ??
              item?.id ??
              `TRACE-${index + 1}`;

            const origin =
              item?.origin ||
              item?.evidence_origin ||
              item?.origin_type ||
              item?.source ||
              item?.source_type ||
              item?.evidence_source ||
              item?.source_system ||
              item?.module ||
              item?.created_by ||
              "System";

            const status =
              item?.status ||
              "Active";

            return (
              <tr key={`${traceId}-${index}`}>
                <td style={{ color: "#000000" }}>
                  {traceId}
                </td>

                <td style={{ color: "#000000" }}>
                  {origin}
                </td>

                <td style={{ color: "#000000" }}>
                  {status}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan="3"
              style={{
                color: "#000000",
                textAlign: "center",
                padding: "20px",
              }}
            >
              No Evidence Available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default EvidenceTable;