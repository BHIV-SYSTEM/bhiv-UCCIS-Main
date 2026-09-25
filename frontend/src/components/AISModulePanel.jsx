import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAISData, getAISStats } from "../services/aisApi";
import "./AISModulePanel.css";

const EMPTY_STATS = {
  totalRecords: 0,
  uniqueVessels: 0,
  averageSOG: 0,
  firstTimestamp: null,
  lastTimestamp: null,
  vesselTypes: {},
};

const AISModulePanel = ({ taskId, moduleName }) => {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAIS = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [statsResponse, dataResponse] = await Promise.all([
        getAISStats(),
        getAISData({ limit: 8 }),
      ]);

      setStats(statsResponse?.stats || EMPTY_STATS);
      setRows(Array.isArray(dataResponse?.data) ? dataResponse.data : []);
    } catch (err) {
      console.error("AIS module panel error:", err);
      setError(
        err?.response?.data?.message ||
          "AIS data could not be loaded from the UCCIS backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAIS();

    const timer = setInterval(loadAIS, 10000);
    return () => clearInterval(timer);
  }, [loadAIS, taskId]);

  const vesselTypeCount = useMemo(
    () => Object.keys(stats.vesselTypes || {}).length,
    [stats.vesselTypes]
  );

  return (
    <section className="ais-module-panel">
      <div className="ais-module-header">
        <div>
          {/* <div className="ais-module-eyebrow">
            AIS DATA FEED • {String(taskId || "").toUpperCase()}
          </div> */}
          <h3>AIS Intelligence</h3>
          {/* <p>
            AIS_file.csv data available inside{" "}
            <strong>{moduleName}</strong>
          </p> */}
        </div>

        {/* <div className="ais-module-live">
          <span />
          LIVE DATA
        </div> */}
      </div>

      {error ? (
        <div className="ais-module-error">
          <strong>AIS feed unavailable</strong>
          <span>{error}</span>
        </div>
      ) : (
        <>
          <div className="ais-module-kpis">
            <div>
              <span>AIS RECORDS</span>
              <strong>
                {loading
                  ? "..."
                  : Number(stats.totalRecords || 0).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>UNIQUE VESSELS</span>
              <strong>
                {loading
                  ? "..."
                  : Number(stats.uniqueVessels || 0).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>AVG SOG</span>
              <strong>
                {loading ? "..." : stats.averageSOG}{" "}
                {!loading && <small>kn</small>}
              </strong>
            </div>

            <div>
              <span>VESSEL TYPES</span>
              <strong>
                {loading ? "..." : vesselTypeCount}
              </strong>
            </div>
          </div>

          <div className="ais-module-data">
            <div className="ais-module-data-head">
              <div>
                <strong>Live AIS Records</strong>
                {/* <span>
                  Source: backend/data/AIS_file.csv
                </span> */}
              </div>

              <button
                type="button"
                onClick={loadAIS}
                disabled={loading}
              >
                {loading ? "Loading..." : "↻ Refresh"}
              </button>
            </div>

            <div className="ais-module-table-wrap">
              <table className="ais-module-table">
                <thead>
                  <tr>
                    <th>MMSI</th>
                    <th>DATE / TIME</th>
                    <th>LAT</th>
                    <th>LON</th>
                    <th>SOG</th>
                    <th>TYPE</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={`${row.MMSI}-${row.BaseDateTime}-${index}`}
                    >
                      <td>{row.MMSI}</td>
                      <td>{row.BaseDateTime}</td>
                      <td>{Number(row.LAT).toFixed(4)}</td>
                      <td>{Number(row.LON).toFixed(4)}</td>
                      <td>{Number(row.SOG).toFixed(1)} kn</td>
                      <td>
                        <span className="ais-vessel-type">
                          {row.VesselType}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {!loading && rows.length === 0 && (
                    <tr>
                      <td colSpan="6" className="ais-module-empty">
                        No AIS records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default AISModulePanel;
