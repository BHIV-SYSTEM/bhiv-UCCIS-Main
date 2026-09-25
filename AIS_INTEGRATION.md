# UCCIS + AIS CSV Integration

This version connects the uploaded `AIS_file.csv` to the existing UCCIS Node/Express backend and adds a React frontend dashboard.

## Backend

CSV location:

`backend/data/AIS_file.csv`

APIs:

- `GET /api/ais/stats`
- `GET /api/ais?limit=200`
- `GET /api/ais?mmsi=368084090`
- `GET /api/ais?vesselType=57`
- `GET /api/ais?from=2022-01-01T00:00:00&to=2022-01-01T12:00:00`

The AIS endpoints are deliberately exempted from the MongoDB request guard, so the AIS dashboard works even when MongoDB is unavailable.

## Frontend

Open:

`http://localhost:3000/ais`

The main UCCIS dashboard also has an `AIS Intelligence` item in its sidebar.

Frontend API configuration is in `frontend/.env`:

`REACT_APP_API_URL=http://localhost:5000/api`

## Run

Terminal 1:

```bash
cd backend
npm install
npm start
```

Terminal 2:

```bash
cd frontend
npm install
npm start
```

Then visit `http://localhost:3000/ais`.
