import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAISData, getAISStats } from '../services/aisApi';
import './AISDashboard.css';

const EMPTY_STATS = {
  totalRecords: 0,
  uniqueVessels: 0,
  averageSOG: 0,
  firstTimestamp: null,
  lastTimestamp: null,
  vesselTypes: {}
};

function AISDashboard() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [vesselType, setVesselType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [statsResponse, dataResponse] = await Promise.all([
        getAISStats(),
        getAISData({ limit: 200 })
      ]);

      setStats(statsResponse.stats || EMPTY_STATS);
      setRows(dataResponse.data || []);
    } catch (err) {
      console.error('AIS dashboard error:', err);
      setError(
        err.response?.data?.message ||
        'Unable to connect to the UCCIS backend. Make sure the backend is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch = !term ||
        String(row.MMSI).toLowerCase().includes(term) ||
        String(row.BaseDateTime).toLowerCase().includes(term);

      const matchesType = !vesselType || String(row.VesselType) === vesselType;

      return matchesSearch && matchesType;
    });
  }, [rows, search, vesselType]);

  const vesselTypeOptions = Object.keys(stats.vesselTypes || {}).sort(
    (a, b) => Number(a) - Number(b)
  );

  return (
    <div className="ais-dashboard">
      <header className="ais-header">
        <div>
          <div className="ais-eyebrow">UCCIS • LIVE DATA SOURCE</div>
          <h1>AIS Intelligence Dashboard</h1>
          <p>Automatic Identification System records connected directly to the UCCIS backend.</p>
        </div>
        <div className="ais-header-actions">
          <Link className="ais-back" to="/">← UCCIS Dashboard</Link>
          <button className="ais-refresh" onClick={load} disabled={loading}>
            {loading ? 'Loading…' : '↻ Refresh'}
          </button>
        </div>
      </header>

      {error && (
        <div className="ais-error">
          <strong>Backend connection error</strong>
          <span>{error}</span>
        </div>
      )}

      <main className="ais-content">
        <section className="ais-kpis">
          <div className="ais-card">
            <span>Total AIS Records</span>
            <strong>{stats.totalRecords.toLocaleString()}</strong>
          </div>
          <div className="ais-card">
            <span>Unique Vessels</span>
            <strong>{stats.uniqueVessels.toLocaleString()}</strong>
          </div>
          <div className="ais-card">
            <span>Average SOG</span>
            <strong>{stats.averageSOG} <small>knots</small></strong>
          </div>
          <div className="ais-card">
            <span>Vessel Types</span>
            <strong>{vesselTypeOptions.length}</strong>
          </div>
        </section>

        <section className="ais-panel">
          <div className="ais-panel-heading">
            <div>
              <h2>AIS Data Explorer</h2>
              <p>Data is served by Express from <code>backend/data/AIS_file.csv</code>.</p>
            </div>
            <span className="ais-source">CSV → Express API → React</span>
          </div>

          <div className="ais-filters">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search MMSI or timestamp…"
            />
            <select value={vesselType} onChange={(e) => setVesselType(e.target.value)}>
              <option value="">All vessel types</option>
              {vesselTypeOptions.map((type) => (
                <option key={type} value={type}>Type {type}</option>
              ))}
            </select>
            <span className="ais-result-count">Showing {filteredRows.length} loaded records</span>
          </div>

          <div className="ais-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>MMSI</th>
                  <th>Date / Time</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>SOG</th>
                  <th>Vessel Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, index) => (
                  <tr key={`${row.MMSI}-${row.BaseDateTime}-${index}`}>
                    <td className="ais-mono">{row.MMSI}</td>
                    <td>{row.BaseDateTime}</td>
                    <td>{Number(row.LAT).toFixed(5)}</td>
                    <td>{Number(row.LON).toFixed(5)}</td>
                    <td>{Number(row.SOG).toFixed(1)} kn</td>
                    <td><span className="ais-type">{row.VesselType}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && !filteredRows.length && (
              <div className="ais-empty">No AIS records match your filters.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AISDashboard;
