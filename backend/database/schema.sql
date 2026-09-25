CREATE TABLE telemetry (
  telemetry_id TEXT PRIMARY KEY,
  signal_source TEXT,
  severity TEXT,
  district TEXT,
  created_at TEXT
);

CREATE TABLE escalations (
  escalation_id TEXT PRIMARY KEY,
  telemetry_id TEXT,
  escalation_level TEXT,
  status TEXT,
  assigned_operator TEXT,
  created_at TEXT
);

CREATE TABLE replay_events (
  replay_id TEXT PRIMARY KEY,
  escalation_id TEXT,
  replay_type TEXT,
  replay_timestamp TEXT
);