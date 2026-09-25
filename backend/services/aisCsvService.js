const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../data/AIS_file.csv');

let cache = {
  mtimeMs: 0,
  rows: []
};

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function loadAISRows() {
  const stat = fs.statSync(CSV_PATH);

  if (cache.rows.length && cache.mtimeMs === stat.mtimeMs) {
    return cache.rows;
  }

  const text = fs.readFileSync(CSV_PATH, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter(Boolean);

  if (!lines.length) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.trim());

  const rows = lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });

    return {
      MMSI: row.MMSI,
      BaseDateTime: row.BaseDateTime,
      LAT: Number(row.LAT),
      LON: Number(row.LON),
      SOG: Number(row.SOG),
      VesselType: Number(row.VesselType)
    };
  });

  cache = {
    mtimeMs: stat.mtimeMs,
    rows
  };

  return rows;
}

function getAISData({ limit, offset, mmsi, vesselType, from, to } = {}) {
  let rows = loadAISRows();

  if (mmsi) {
    rows = rows.filter((row) => String(row.MMSI) === String(mmsi));
  }

  if (vesselType !== undefined && vesselType !== '') {
    rows = rows.filter((row) => String(row.VesselType) === String(vesselType));
  }

  if (from) {
    rows = rows.filter((row) => row.BaseDateTime >= from);
  }

  if (to) {
    rows = rows.filter((row) => row.BaseDateTime <= to);
  }

  const safeOffset = Math.max(Number(offset) || 0, 0);
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 1000);

  return {
    total: rows.length,
    offset: safeOffset,
    limit: safeLimit,
    data: rows.slice(safeOffset, safeOffset + safeLimit)
  };
}

function getAISStats() {
  const rows = loadAISRows();
  const vesselTypes = {};
  const uniqueMMSI = new Set();

  let totalSOG = 0;
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  rows.forEach((row) => {
    uniqueMMSI.add(String(row.MMSI));
    vesselTypes[row.VesselType] = (vesselTypes[row.VesselType] || 0) + 1;
    totalSOG += Number.isFinite(row.SOG) ? row.SOG : 0;
    minLat = Math.min(minLat, row.LAT);
    maxLat = Math.max(maxLat, row.LAT);
    minLon = Math.min(minLon, row.LON);
    maxLon = Math.max(maxLon, row.LON);
  });

  return {
    totalRecords: rows.length,
    uniqueVessels: uniqueMMSI.size,
    averageSOG: rows.length ? Number((totalSOG / rows.length).toFixed(2)) : 0,
    firstTimestamp: rows[0]?.BaseDateTime || null,
    lastTimestamp: rows[rows.length - 1]?.BaseDateTime || null,
    boundingBox: rows.length
      ? { minLat, maxLat, minLon, maxLon }
      : null,
    vesselTypes
  };
}

module.exports = {
  loadAISRows,
  getAISData,
  getAISStats
};
