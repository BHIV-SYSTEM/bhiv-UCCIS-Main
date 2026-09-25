// =====================================================
// UCCIS DATABASE CONFIGURATION
// MongoDB Atlas + Aiven MySQL + SQLite
// =====================================================

require("dotenv").config();

const dns = require("dns");
const mongoose = require("mongoose");
const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql2/promise");
const path = require("path");
const fs = require("fs");

// =====================================================
// DNS - MongoDB Atlas
// =====================================================

try {
  dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
  ]);
} catch (error) {
  console.warn(
    "DNS configuration warning:",
    error.message
  );
}

// =====================================================
// SQLITE HELPER
// =====================================================

function openSQLiteDatabase(dbPath, label) {
  const directory = path.dirname(dbPath);

  // Create parent directory if it does not exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, {
      recursive: true
    });
  }

  const database = new sqlite3.Database(
    dbPath,
    (err) => {
      if (err) {
        console.error("======================================");
        console.error(`${label} Connection Error`);
        console.error(err.message);
        console.error("======================================");
      } else {
        console.log("======================================");
        console.log(`${label} Connected`);
        console.log(`Database: ${dbPath}`);
        console.log("======================================");
      }
    }
  );

  return database;
}

// =====================================================
// SQLITE QUERY COMPATIBILITY API
// =====================================================

function attachQueryAPI(database) {
  if (!database) {
    return database;
  }

  database.query = function (
    sql,
    params = [],
    callback
  ) {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }

    return new Promise((resolve, reject) => {
      const normalizedSQL = String(sql)
        .trim()
        .toLowerCase();

      // SELECT / PRAGMA / WITH
      if (
        normalizedSQL.startsWith("select") ||
        normalizedSQL.startsWith("pragma") ||
        normalizedSQL.startsWith("with")
      ) {
        database.all(
          sql,
          params,
          (err, rows) => {
            if (err) {
              if (callback) {
                callback(err);
              }

              reject(err);
              return;
            }

            const result = [
              rows || [],
              []
            ];

            if (callback) {
              callback(null, result);
            }

            resolve(result);
          }
        );

        return;
      }

      // INSERT / UPDATE / DELETE / CREATE
      database.run(
        sql,
        params,
        function (err) {
          if (err) {
            if (callback) {
              callback(err);
            }

            reject(err);
            return;
          }

          const result = [
            {
              affectedRows: this.changes || 0,
              insertId: this.lastID || 0,
              changes: this.changes || 0
            },
            []
          ];

          if (callback) {
            callback(null, result);
          }

          resolve(result);
        }
      );
    });
  };

  // ===================================================
  // MYSQL-STYLE PROMISE API
  // ===================================================

  database.promise = function () {
    return {
      query: async function (
        sql,
        params = []
      ) {
        return database.query(
          sql,
          params
        );
      },

      execute: async function (
        sql,
        params = []
      ) {
        return database.query(
          sql,
          params
        );
      },

      getConnection: async function () {
        return {
          query: database.query.bind(database),
          execute: database.query.bind(database),

          release: function () {
            // SQLite does not need
            // connection release
          }
        };
      }
    };
  };

  // ===================================================
  // MYSQL-STYLE GET CONNECTION
  // ===================================================

  database.getConnection = function (
    callback
  ) {
    const connection = {
      query: database.query.bind(database),
      execute: database.query.bind(database),

      release: function () {
        // SQLite no-op
      }
    };

    if (typeof callback === "function") {
      process.nextTick(() => {
        callback(null, connection);
      });
    }

    return Promise.resolve(connection);
  };

  return database;
}

// =====================================================
// SQLITE DATABASE PATHS
// =====================================================

// Task 23
// Uses: backend/database/sqlite/uccis.db
const task23DatabasePath = path.join(
  __dirname,
  "../database/sqlite/uccis.db"
);

// Task 24
// Uses: backend/uccis.db
const task24DatabasePath = path.join(
  __dirname,
  "uccis.db"
);

// =====================================================
// TASK 23 SQLITE
// =====================================================

const db = attachQueryAPI(
  openSQLiteDatabase(
    task23DatabasePath,
    "Task 23 SQLite DB"
  )
);

// =====================================================
// TASK 24 SQLITE
// =====================================================

const task24DB = attachQueryAPI(
  openSQLiteDatabase(
    task24DatabasePath,
    "Task 24 SQLite DB"
  )
);

// =====================================================
// TASK 25 SQLITE
// =====================================================

let task25DB;

try {
  task25DB = require("./sqlite");

  if (
    task25DB &&
    typeof task25DB.query !== "function"
  ) {
    task25DB = attachQueryAPI(task25DB);
  }

} catch (error) {
  console.error(
    "Task 25 SQLite initialization error:",
    error.message
  );

  task25DB = task24DB;
}

// =====================================================
// SQLITE SCHEMA INITIALIZATION
// =====================================================

function initializeSQLiteDatabase(
  database,
  label
) {
  if (!database) {
    return;
  }

  database.serialize(() => {

    // -------------------------------------------------
    // SIGNALS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS signals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        signal_id TEXT,
        signal_type TEXT,
        location_id TEXT,
        trace_id TEXT,
        status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // TELEMETRY
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        signal_id TEXT,
        type TEXT,
        value REAL,
        status TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // TELEMETRY EVENTS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS telemetry_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT,
        signal_id TEXT,
        event_status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // INCIDENTS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_id TEXT,
        event_id TEXT,
        title TEXT,
        severity TEXT,
        status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // ESCALATIONS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS escalations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        escalation_id TEXT,
        incident_id TEXT,
        escalated_to TEXT,
        status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // DECISIONS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS decisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        decision_id TEXT,
        escalation_id TEXT,
        decision_text TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // APPROVALS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS approvals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        approval_id TEXT,
        decision_id TEXT,
        approved_by TEXT,
        status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // REPLAY SESSIONS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS replay_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        replay_id TEXT,
        incident_id TEXT,
        replay_result TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // REPLAY EVENTS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS replay_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        replay_id TEXT,
        event TEXT,
        severity TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // RUNTIME LOGS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS runtime_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        replay_id TEXT,
        module TEXT,
        log_message TEXT,
        level TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // RUNTIME EVIDENCE
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS runtime_evidence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trace_id TEXT,
        evidence TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // LOCATIONS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_id TEXT,
        district TEXT,
        state TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // OPERATORS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS operators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operator_id TEXT,
        name TEXT,
        status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // ALERTS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        severity TEXT,
        status TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // RECOMMENDATIONS
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recommendation TEXT,
        priority TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // -------------------------------------------------
    // RUNTIMES
    // -------------------------------------------------

    database.run(`
      CREATE TABLE IF NOT EXISTS runtimes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_name TEXT,
        status TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log(
      `${label}: schema ready`
    );
  });
}

// =====================================================
// INITIALIZE SQLITE
// =====================================================

initializeSQLiteDatabase(
  db,
  "Task 23 SQLite"
);

initializeSQLiteDatabase(
  task24DB,
  "Task 24 SQLite"
);

// =====================================================
// MYSQL - AIVEN
// Tasks 27 / 28 / 29 / 30 / 31 / 32 / 33 / 34
// =====================================================

const MYSQL_HOST =
  process.env.DB_HOST ||
  process.env.MYSQL_HOST;

const MYSQL_PORT =
  Number(
    process.env.DB_PORT ||
    process.env.MYSQL_PORT ||
    3306
  );

const MYSQL_USER =
  process.env.DB_USER ||
  process.env.MYSQL_USER;

const MYSQL_PASSWORD =
  process.env.DB_PASSWORD ||
  process.env.MYSQL_PASSWORD;

const MAIN_DATABASE =
  process.env.DB_NAME ||
  process.env.MYSQL_DATABASE ||
  "uccis";

// =====================================================
// TASK DATABASE NAMES
// =====================================================

const TASK32_DATABASE =
  process.env.TASK32_DB_NAME ||
  MAIN_DATABASE;

const TASK33_DATABASE =
  process.env.TASK33_DB_NAME ||
  MAIN_DATABASE;

const TASK34_DATABASE =
  process.env.TASK34_DB_NAME ||
  MAIN_DATABASE;

// =====================================================
// VALIDATE MYSQL CONFIGURATION
// =====================================================

function validateMySQLConfiguration() {
  const missing = [];

  if (!MYSQL_HOST) {
    missing.push("DB_HOST");
  }

  if (!MYSQL_USER) {
    missing.push("DB_USER");
  }

  if (!MYSQL_PASSWORD) {
    missing.push("DB_PASSWORD");
  }

  if (!MAIN_DATABASE) {
    missing.push("DB_NAME");
  }

  if (missing.length > 0) {
    console.warn(
      "⚠️ MySQL configuration missing:",
      missing.join(", ")
    );

    return false;
  }

  return true;
}

// =====================================================
// CREATE AIVEN MYSQL POOL
// =====================================================

function createMySQLPool(
  databaseName = MAIN_DATABASE
) {
  if (!validateMySQLConfiguration()) {
    return null;
  }

  return mysql.createPool({
    host: MYSQL_HOST,

    port: MYSQL_PORT,

    user: MYSQL_USER,

    password: MYSQL_PASSWORD,

    database:
      databaseName ||
      MAIN_DATABASE,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0,

    enableKeepAlive: true,

    keepAliveInitialDelay: 10000,

    connectTimeout: 15000,

    ssl: {
      rejectUnauthorized: false
    }
  });
}

// =====================================================
// MAIN MYSQL DATABASE
// =====================================================

const mysqlDB =
  createMySQLPool(MAIN_DATABASE);

// =====================================================
// TASK 28
// =====================================================

const task28DB =
  mysqlDB;

// =====================================================
// TASK 30
// =====================================================

const task30DB =
  mysqlDB;

// =====================================================
// TASK 31
// =====================================================

const task31DB =
  mysqlDB;

// =====================================================
// MYSQL CONNECTION (TASK 32)
// RUNTIME CHAIN ENGINE
// =====================================================

// Use the existing Aiven UCCIS database.
// Do NOT use uccis_runtime because that database
// does not exist on the current Aiven server.

const TASK32_RUNTIME_DATABASE =
  process.env.DB_NAME ||
  process.env.MYSQL_DATABASE ||
  "uccis";

const task32DB = mysql.createPool({
  host:
    process.env.DB_HOST ||
    process.env.MYSQL_HOST,

  port:
    Number(
      process.env.DB_PORT ||
      process.env.MYSQL_PORT ||
      3306
    ),

  user:
    process.env.DB_USER ||
    process.env.MYSQL_USER,

  password:
    process.env.DB_PASSWORD ||
    process.env.MYSQL_PASSWORD,

  database: TASK32_RUNTIME_DATABASE,

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0,

  connectTimeout: 15000,

  enableKeepAlive: true,

  keepAliveInitialDelay: 10000,

  ssl: {
    rejectUnauthorized: false
  }
});

// =====================================================
// TASK 33
// =====================================================

// Task 33 uses the same Aiven database shown in the project
// configuration (defaultdb). The Task 33 tables are created
// non-destructively below so the runtime APIs do not fail with
// "table does not exist" on a fresh database.
const task33DB =
  createMySQLPool(
    TASK33_DATABASE
  );

let task33Ready = Promise.resolve();

async function initializeTask33MySQL() {
  if (!task33DB) {
    return;
  }

  const statements = [
    `CREATE TABLE IF NOT EXISTS signals (
      signal_id INT AUTO_INCREMENT PRIMARY KEY,
      trace_id VARCHAR(100) NOT NULL UNIQUE,
      signal_type VARCHAR(100) NOT NULL,
      source_system VARCHAR(100),
      severity VARCHAR(50) DEFAULT 'LOW',
      status VARCHAR(50) DEFAULT 'ACTIVE',
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS telemetry (
      telemetry_id INT AUTO_INCREMENT PRIMARY KEY,
      trace_id VARCHAR(100) NOT NULL,
      metric_name VARCHAR(100),
      metric_value VARCHAR(255),
      status VARCHAR(50) DEFAULT 'ACTIVE',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS incidents (
      incident_id INT AUTO_INCREMENT PRIMARY KEY,
      trace_id VARCHAR(100) NOT NULL,
      incident_type VARCHAR(100),
      severity VARCHAR(50),
      status VARCHAR(50) DEFAULT 'OPEN',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS escalations (
      escalation_id INT AUTO_INCREMENT PRIMARY KEY,
      trace_id VARCHAR(100) NOT NULL,
      escalation_level VARCHAR(50),
      status VARCHAR(50) DEFAULT 'ACTIVE',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS replay_events (
      replay_id INT AUTO_INCREMENT PRIMARY KEY,
      trace_id VARCHAR(100) NOT NULL,
      replay_status VARCHAR(50) DEFAULT 'READY',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS runtime_evidence (
      evidence_id INT AUTO_INCREMENT PRIMARY KEY,
      trace_id VARCHAR(100) NOT NULL,
      origin VARCHAR(255),
      payload LONGTEXT,
      status VARCHAR(50) DEFAULT 'ACTIVE',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS runtime_audit (
      audit_id INT AUTO_INCREMENT PRIMARY KEY,
      trace_id VARCHAR(100),
      endpoint VARCHAR(255),
      method VARCHAR(20),
      status_code INT,
      response_time BIGINT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS runtime_health (
      health_id INT AUTO_INCREMENT PRIMARY KEY,
      backend_status VARCHAR(50),
      database_status VARCHAR(50),
      signal_count INT DEFAULT 0,
      incident_count INT DEFAULT 0,
      replay_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const sql of statements) {
    await task33DB.query(sql);
  }

  // Seed only when Task 33 has no signal rows. Existing data is never deleted.
  const [countRows] = await task33DB.query(
    "SELECT COUNT(*) AS count FROM signals"
  );

  if (Number(countRows[0]?.count || 0) === 0) {
    await task33DB.query(`
      INSERT INTO signals
      (trace_id, signal_type, source_system, severity, status, description)
      VALUES
      ('TRACE-001','FLOOD','SENSOR','HIGH','ACTIVE','Flood detected'),
      ('TRACE-002','CYCLONE','WEATHER_ENGINE','CRITICAL','ACTIVE','Cyclone alert'),
      ('TRACE-003','NETWORK_FAILURE','NOC','MEDIUM','ACTIVE','Network outage detected'),
      ('TRACE-004','SERVER_OVERLOAD','DATACENTER','HIGH','ACTIVE','CPU utilization exceeded threshold'),
      ('TRACE-005','EARTHQUAKE','SENSOR','HIGH','ACTIVE','Earthquake detected'),
      ('TRACE-006','POWER_FAILURE','GRID','MEDIUM','ACTIVE','Power failure detected'),
      ('TRACE-007','LANDSLIDE','SENSOR','HIGH','ACTIVE','Landslide detected'),
      ('TRACE-008','FIRE_ALERT','FIRE_SYSTEM','CRITICAL','ACTIVE','Fire alert detected')
    `);

    await task33DB.query(`
      INSERT INTO telemetry
      (trace_id, metric_name, metric_value, status)
      VALUES
      ('TRACE-001','Water Level','12m','ACTIVE'),
      ('TRACE-002','Wind Speed','180km/h','ACTIVE'),
      ('TRACE-003','Packet Loss','35%','ACTIVE'),
      ('TRACE-004','CPU Usage','98%','ACTIVE'),
      ('TRACE-005','Magnitude','6.5','ACTIVE'),
      ('TRACE-006','Voltage','0','ACTIVE')
    `);

    await task33DB.query(`
      INSERT INTO incidents
      (trace_id, incident_type, severity, status)
      VALUES
      ('TRACE-001','FLOOD_INCIDENT','HIGH','OPEN'),
      ('TRACE-002','CYCLONE_INCIDENT','CRITICAL','OPEN'),
      ('TRACE-003','NETWORK_INCIDENT','MEDIUM','OPEN'),
      ('TRACE-004','SERVER_INCIDENT','HIGH','OPEN'),
      ('TRACE-005','EARTHQUAKE_INCIDENT','HIGH','OPEN')
    `);

    await task33DB.query(`
      INSERT INTO escalations
      (trace_id, escalation_level, status)
      VALUES
      ('TRACE-001','LEVEL_2','ACTIVE'),
      ('TRACE-002','LEVEL_3','ACTIVE'),
      ('TRACE-004','LEVEL_2','ACTIVE')
    `);

    await task33DB.query(`
      INSERT INTO replay_events
      (trace_id, replay_status)
      VALUES
      ('TRACE-001','READY'),
      ('TRACE-002','EXECUTED'),
      ('TRACE-003','READY'),
      ('TRACE-004','EXECUTED'),
      ('TRACE-005','READY'),
      ('TRACE-006','EXECUTED'),
      ('TRACE-007','READY')
    `);

    await task33DB.query(`
      INSERT INTO runtime_evidence
      (trace_id, origin, payload, status)
      VALUES
      ('TRACE-001','Flood Scenario','{"waterLevel":"12m"}','ACTIVE'),
      ('TRACE-002','Cyclone Scenario','{"windSpeed":"180km/h"}','ACTIVE'),
      ('TRACE-003','Network Scenario','{"packetLoss":"35%"}','ACTIVE'),
      ('TRACE-004','Server Scenario','{"cpuUsage":"98%"}','ACTIVE'),
      ('TRACE-005','Earthquake Scenario','{"magnitude":"6.5"}','ACTIVE'),
      ('TRACE-006','Power Failure Scenario','{"voltage":"0"}','ACTIVE'),
      ('TRACE-007','Landslide Scenario','{"risk":"HIGH"}','ACTIVE'),
      ('TRACE-008','Fire Scenario','{"temperature":"450"}','ACTIVE'),
      ('TRACE-001','Verification Evidence','{"status":"PASSED"}','ACTIVE')
    `);

    await task33DB.query(`
      INSERT INTO runtime_health
      (backend_status, database_status, signal_count, incident_count, replay_count)
      VALUES ('UP','CONNECTED',8,5,7)
    `);
  }

  console.log(`✅ Task 33 MySQL schema ready: ${TASK33_DATABASE}`);
}

task33Ready = initializeTask33MySQL().catch((error) => {
  console.error("❌ Task 33 MySQL initialization failed:", error.message);
  throw error;
});

// =====================================================
// TASK 34
// =====================================================

const task34DB =
  createMySQLPool(
    TASK34_DATABASE
  );

// =====================================================
// MYSQL CONNECTION TEST
// =====================================================

async function testMySQLConnection(
  pool,
  label
) {
  if (!pool) {
    console.warn(
      `⚠️ ${label}: MySQL pool not initialized`
    );

    return false;
  }

  let connection;

  try {
    connection =
      await pool.getConnection();

    await connection.query(
      "SELECT 1 AS connected"
    );

    console.log(
      `✅ ${label} MySQL Connected`
    );

    return true;

  } catch (error) {

    console.error(
      `❌ ${label} MySQL Connection Failed:`,
      error.message
    );

    return false;

  } finally {

    if (connection) {
      connection.release();
    }
  }
}

// =====================================================
// TEST ALL MYSQL CONNECTIONS
// =====================================================

async function testAllMySQLConnections() {

  console.log("");
  console.log(
    "======================================"
  );
  console.log(
    "Testing Aiven MySQL Connections"
  );
  console.log(
    "======================================"
  );

  const results = {};

  results.main =
    await testMySQLConnection(
      mysqlDB,
      "UCCIS Main"
    );

  results.task32 =
    await testMySQLConnection(
      task32DB,
      "Task 32"
    );

  results.task33 =
    await testMySQLConnection(
      task33DB,
      "Task 33"
    );

  results.task34 =
    await testMySQLConnection(
      task34DB,
      "Task 34"
    );

  console.log(
    "======================================"
  );
  console.log("");

  return results;
}

// =====================================================
// MONGODB ATLAS
// =====================================================

const connectDB = async () => {

  const mongoUri =
    process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGO_URI is not configured"
    );
  }

  try {

    // Already connected
    if (
      mongoose.connection.readyState === 1
    ) {
      return mongoose.connection;
    }

    console.log(
      "======================================"
    );

    console.log(
      "Connecting to MongoDB Atlas..."
    );

    console.log(
      "======================================"
    );

    const conn =
      await mongoose.connect(
        mongoUri,
        {
          serverSelectionTimeoutMS: 15000,

          connectTimeoutMS: 15000,

          socketTimeoutMS: 45000,

          maxPoolSize: 10,

          minPoolSize: 1
        }
      );

    console.log(
      "======================================"
    );

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`
    );

    console.log(
      `✅ MongoDB Database: ${conn.connection.name}`
    );

    console.log(
      "======================================"
    );

    return conn;

  } catch (error) {

    console.error(
      "======================================"
    );

    console.error(
      "❌ MongoDB Connection Failed"
    );

    console.error(
      error.message
    );

    console.error(
      "======================================"
    );

    throw error;
  }
};

// =====================================================
// TASK 35 MONGODB
// =====================================================

const connectDBTask35 =
  async () => {
    return connectDB();
  };

// =====================================================
// TASK 36 MONGODB
// =====================================================

const connectDBTask36 =
  async () => {
    return connectDB();
  };

// =====================================================
// TASK 33 DATABASE HEALTH
// =====================================================

const checkDatabaseHealthTask33 =
  async () => {

    try {

      if (!task33DB) {
        return {
          success: false,
          status: "DISCONNECTED",
          database: TASK33_DATABASE,
          error:
            "MySQL pool not initialized"
        };
      }

      const [
        rows
      ] =
        await task33DB.query(
          "SELECT NOW() AS server_time"
        );

      return {
        success: true,
        status: "CONNECTED",
        database: TASK33_DATABASE,
        serverTime:
          rows[0]?.server_time ||
          new Date().toISOString()
      };

    } catch (error) {

      return {
        success: false,
        status: "DISCONNECTED",
        database: TASK33_DATABASE,
        error: error.message
      };
    }
  };

// =====================================================
// TASK 33 DATABASE STATS
// =====================================================

const getDatabaseStatsTask33 =
  async () => {

    try {

      if (!task33DB) {
        throw new Error(
          "MySQL pool not initialized"
        );
      }

      const [
        signals
      ] =
        await task33DB.query(
          "SELECT COUNT(*) AS count FROM signals"
        );

      const [
        telemetry
      ] =
        await task33DB.query(
          "SELECT COUNT(*) AS count FROM telemetry"
        );

      const [
        incidents
      ] =
        await task33DB.query(
          "SELECT COUNT(*) AS count FROM incidents"
        );

      const [
        escalations
      ] =
        await task33DB.query(
          "SELECT COUNT(*) AS count FROM escalations"
        );

      const [
        replays
      ] =
        await task33DB.query(
          "SELECT COUNT(*) AS count FROM replay_events"
        );

      const [
        evidence
      ] =
        await task33DB.query(
          "SELECT COUNT(*) AS count FROM runtime_evidence"
        );

      return {
        success: true,
        database: TASK33_DATABASE,
        signals:
          signals[0]?.count || 0,
        telemetry:
          telemetry[0]?.count || 0,
        incidents:
          incidents[0]?.count || 0,
        escalations:
          escalations[0]?.count || 0,
        replays:
          replays[0]?.count || 0,
        evidence:
          evidence[0]?.count || 0
      };

    } catch (error) {

      return {
        success: false,
        database: TASK33_DATABASE,
        error: error.message
      };
    }
  };

// =====================================================
// TASK 33 COMMAND CENTER METRICS
// =====================================================

const getCommandCenterMetricsTask33 =
  async () => {

    try {

      if (!task33DB) {
        throw new Error(
          "MySQL pool not initialized"
        );
      }

      const [
        signalCount
      ] =
        await task33DB.query(
          "SELECT COUNT(*) AS count FROM signals"
        );

      const [
        incidentCount
      ] =
        await task33DB.query(
          "SELECT COUNT(*) AS count FROM incidents"
        );

      const [
        escalationCount
      ] =
        await task33DB.query(
          "SELECT COUNT(*) AS count FROM escalations"
        );

      const [
        replayCount
      ] =
        await task33DB.query(
          "SELECT COUNT(*) AS count FROM replay_events"
        );

      const [
        evidenceCount
      ] =
        await task33DB.query(
          "SELECT COUNT(*) AS count FROM runtime_evidence"
        );

      return {
        success: true,
        database: TASK33_DATABASE,
        signalCount:
          signalCount[0]?.count || 0,
        incidentCount:
          incidentCount[0]?.count || 0,
        escalationCount:
          escalationCount[0]?.count || 0,
        replayCount:
          replayCount[0]?.count || 0,
        evidenceCount:
          evidenceCount[0]?.count || 0
      };

    } catch (error) {

      return {
        success: false,
        database: TASK33_DATABASE,
        error: error.message
      };
    }
  };

// =====================================================
// TASK 33 TRACE COUNT
// =====================================================

const getTraceCountTask33 =
  async () => {

    try {

      if (!task33DB) {
        return 0;
      }

      const [
        rows
      ] =
        await task33DB.query(`
          SELECT
            COUNT(DISTINCT trace_id)
            AS totalTraces
          FROM signals
          WHERE trace_id IS NOT NULL
        `);

      return (
        rows[0]?.totalTraces || 0
      );

    } catch (error) {

      console.error(
        "Task 33 trace count error:",
        error.message
      );

      return 0;
    }
  };

// =====================================================
// TASK 33 LAST EXECUTION
// =====================================================

const getLastExecutionTask33 =
  async () => {

    try {

      if (!task33DB) {
        return null;
      }

      const [
        rows
      ] =
        await task33DB.query(`
          SELECT
            created_at
          FROM signals
          ORDER BY created_at DESC
          LIMIT 1
        `);

      if (
        !rows ||
        !rows.length
      ) {
        return null;
      }

      return rows[0].created_at;

    } catch (error) {

      return null;
    }
  };

// =====================================================
// ATTACH TASK 33 HELPERS
// =====================================================

if (task33DB) {

  task33DB.checkDatabaseHealth =
    checkDatabaseHealthTask33;

  task33DB.getDatabaseStats =
    getDatabaseStatsTask33;

  task33DB.getCommandCenterMetrics =
    getCommandCenterMetricsTask33;

  task33DB.getTraceCount =
    getTraceCountTask33;

  task33DB.getLastExecution =
    getLastExecutionTask33;
}

// =====================================================
// MONGODB EVENTS
// =====================================================

mongoose.connection.on(
  "connected",
  () => {
    console.log(
      "✅ Mongoose connection established"
    );
  }
);

mongoose.connection.on(
  "error",
  (error) => {
    console.error(
      "❌ Mongoose connection error:",
      error.message
    );
  }
);

mongoose.connection.on(
  "disconnected",
  () => {
    console.log(
      "⚠️ Mongoose disconnected"
    );
  }
);

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================

async function closeSQLiteDatabase(
  database
) {
  return new Promise(
    (resolve) => {

      if (!database) {
        resolve();
        return;
      }

      database.close(() => {
        resolve();
      });
    }
  );
}

async function closeMySQLPool(
  pool
) {
  if (!pool) {
    return;
  }

  try {

    await pool.end();

  } catch (error) {

    console.error(
      "MySQL shutdown error:",
      error.message
    );
  }
}

process.on(
  "SIGINT",
  async () => {

    try {

      console.log("");

      console.log(
        "🔴 Closing database connections..."
      );

      // SQLite
      await closeSQLiteDatabase(db);

      if (
        task24DB &&
        task24DB !== db
      ) {
        await closeSQLiteDatabase(
          task24DB
        );
      }

      // MySQL
      const mysqlPools = [
        mysqlDB,
        task32DB,
        task33DB,
        task34DB
      ];

      const uniquePools = [
        ...new Set(
          mysqlPools.filter(Boolean)
        )
      ];

      for (
        const pool of uniquePools
      ) {
        await closeMySQLPool(pool);
      }

      // MongoDB
      if (
        mongoose.connection.readyState !== 0
      ) {
        await mongoose.connection.close();

        console.log(
          "✅ MongoDB connection closed"
        );
      }

      console.log(
        "✅ Database connections closed"
      );

      process.exit(0);

    } catch (error) {

      console.error(
        "Database shutdown error:",
        error.message
      );

      process.exit(1);
    }
  }
);

// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  // MongoDB
  connectDB,
  connectDBTask35,
  connectDBTask36,

  // SQLite
  db,
  task24DB,
  task25DB,

  // MySQL / Aiven
  mysqlDB,
  task28DB,
  task30DB,
  task31DB,
  task32DB,
  task33DB,
  task33Ready,
  task34DB,

  // MySQL Testing
  testMySQLConnection,
  testAllMySQLConnections,

  // Task 33 Helpers
  checkDatabaseHealthTask33,
  getDatabaseStatsTask33,
  getCommandCenterMetricsTask33,
  getTraceCountTask33,
  getLastExecutionTask33
};