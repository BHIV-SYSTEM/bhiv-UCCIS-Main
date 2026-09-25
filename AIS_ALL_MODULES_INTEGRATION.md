# AIS data in all UCCIS workflow modules

The main UCCIS Command Dashboard now mounts `AISModulePanel` above every selected workflow module.
Because the panel is rendered in the shared `uccis-rendered-content` container, Tasks 1-39 receive the same AIS data panel whenever a module is opened.

Data source:
- `backend/data/AIS_file.csv`
- Existing `/api/ais/stats`
- Existing `/api/ais`

The panel displays real CSV-derived:
- total AIS records
- unique vessels
- average SOG
- vessel type count
- sample AIS records (MMSI, timestamp, latitude, longitude, SOG, vessel type)

It refreshes every 10 seconds and has a manual Refresh button.
