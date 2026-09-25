require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const WebSocket = require("ws");
const morgan = require("morgan");

// Task 35: mongoose is not required anywhere else in server.js itself
// (config/db.js has its own separate mongoose require), so this is a
// genuinely new top-level require for this file.
const mongoose = require("mongoose");

// Task 37: its own file required `http` and `mongoose` again and also
// did `const app = require("./app")`. `http` and `mongoose` are already
// required once above (Task 15's `http`, Task 35's `mongoose`), so those
// two requires are skipped as duplicates. `require("./app")` doesn't
// apply here at all — Task 37's file assumed a split app.js/server.js
// layout, but in this merged codebase the Express `app` is defined
// directly in this same file, so there's no separate "./app" module to
// pull in.

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json({ limit: "10mb" })); // Task 25: raised from the default 100kb body limit for larger payloads
app.use(express.urlencoded({ extended: true })); // Task 24: needed for form-encoded bodies
app.use(morgan("dev")); // Task 17: request logging

// Task 27: also logs every request to disk as plain text, separate from
// morgan's console output above and distinct from Task 19's "data" dir and
// Task 21/25's "runtime_logs" dir — this uses its own "logs" directory so
// none of those get clobbered.
app.use((req, res, next) => {
    const logDirTask27 = path.join(process.env.VERCEL ? "/tmp" : __dirname, "logs");

    if (!fs.existsSync(logDirTask27)) {
        fs.mkdirSync(logDirTask27);
    }

    const logFileTask27 = path.join(logDirTask27, "runtime.log");

    const messageTask27 =
        `[${new Date().toISOString()}] ` +
        `${req.method} ${req.originalUrl}\n`;

    fs.appendFileSync(logFileTask27, messageTask27);

    next();
});

// Mounts a route module only if it's actually a valid Express router/middleware
// function. Prevents one bad `module.exports` from crashing the entire server
// with a cryptic "argument handler must be a function" error.
function safeUse(mountPath, routerModule, label) {
    if (typeof routerModule !== "function") {
        console.error(
            `Route mount error: "${label}" (mounted at "${mountPath}") is not a valid ` +
            `Express router. Check that its file ends with "module.exports = router;" ` +
            `where router = express.Router(). Actual export:`, routerModule
        );
        return;
    }
    app.use(mountPath, routerModule);
}

// Task 19: writes a JSON snapshot to /data, prefixed to avoid clobbering
// files already used by Task 1 (e.g. data/alerts.json).
function saveJsonFileTask19(filename, data) {
    const dataDir = path.join(process.env.VERCEL ? "/tmp" : __dirname, "data");

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    fs.writeFileSync(
        path.join(dataDir, `task19-${filename}`),
        JSON.stringify(data, null, 2)
    );
}

// Task 21: reads a plain-text log file from /runtime_logs. Distinct name
// from Task 1/19's readJSON/saveJsonFileTask19 helpers since this reads
// raw text, not JSON, and lives in a different directory.
function readLogTask21(fileName) {
    try {
        const filePath = path.join(process.env.VERCEL ? "/tmp" : path.join(__dirname, "runtime_logs"), fileName);
        return fs.readFileSync(filePath, "utf8");
    } catch (error) {
        return "No logs available.";
    }
}

// Task 25: own SQLite init module, required purely for its side effect
// (opening/initializing its own connection) — no export is ever used, so
// nothing is captured from it.
require("./config/sqlite");

// Task 25: ensure the runtime_logs directory exists.
const runtimeLogDirTask25 = path.join(process.env.VERCEL ? "/tmp" : __dirname, "runtime_logs");
if (!fs.existsSync(runtimeLogDirTask25)) {
    fs.mkdirSync(runtimeLogDirTask25, { recursive: true });
}

// =====================================================
// MONGODB REQUEST GUARD
// =====================================================
// Vercel has no permanent process, so MongoDB is connected lazily and the
// Mongoose connection is reused when the function instance stays warm.
app.use(async (req, res, next) => {
    // Keep basic status endpoints available even if the database is down.
    if (
        req.path === "/" ||
        req.path === "/health" ||
        req.path === "/api/health" ||
        req.path === "/api/ais" ||
        req.path.startsWith("/api/ais/") ||
        req.path.startsWith("/api/v2/task33/") ||
        req.path.startsWith("/api/command-center") ||
        req.path === "/api/system/info" ||
        req.path === "/api/system/database" ||
        req.path === "/api/system/runtime"
    ) {
        return next();
    }

    try {
        await connectMongo();
        next();
    } catch (error) {
        console.error("\u274c Database Error:", error.message);
        res.status(500).json({
            success: false,
            status: "error",
            error_code: "DATABASE_CONNECTION_ERROR",
            message: error.message,
        });
    }
});

// =====================================================
// STATIC FILES
// =====================================================

// Task 6 Test UI
app.use(express.static(path.join(__dirname, "public")));

// Frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// =====================================================
// ROUTES
// =====================================================

// AIS CSV data source (works independently of MongoDB)
const aisRoutes = require("./routes/aisRoutes");
app.use("/api/ais", aisRoutes);

// ---------- Task 3 ----------
const intelligenceRoutes = require("./routes/intelligenceRoutes");

// ---------- Task 4 ----------
const intelligenceRoutesTask4 = require("./routes/intelligenceRoutesTask4");
const executionRoutes = require("./routes/executionRoutes");

// ---------- Task 5 ----------
const zoneRoutes = require("./routes/zones");
const executionTask5Routes = require("./routes/execution");
const snapshotRoutes = require("./routes/snapshot");

// ---------- Task 6 ----------
const executionRoutesTask6 = require("./routes/executionRoutesTask6");
const memoryRoutes = require("./routes/memoryRoutes");
const replayRoutes = require("./routes/replayRoutes");

// ---------- Task 8 ----------
const weather = require("./datasets/weather.json");

const normalizeModule = require("./engine/normalize");
const riskModule = require("./engine/riskEngine");
const reasoningModule = require("./engine/reasoningEngine");
const anomalyEngine = require("./engine/anomalyEngine");
const replayModule = require("./engine/replayEngine");

const normalizeAll =
    typeof normalizeModule === "function" ? normalizeModule : normalizeModule.normalizeAll;

const computeRisk =
    typeof riskModule === "function" ? riskModule : riskModule.computeRisk;

const generateReasoning =
    typeof reasoningModule === "function" ? reasoningModule : reasoningModule.generateReasoning;

const replayState =
    typeof replayModule === "function"
        ? replayModule
        : replayModule.replayState
            ? replayModule.replayState.bind(replayModule)
            : null;

if (typeof replayState !== "function") {
    console.error(
        "Task 8 setup error: \"replayState\" did not resolve to a function. " +
        "Actual export of ./engine/replayEngine:", replayModule
    );
}

[
    ["normalizeAll", normalizeAll],
    ["computeRisk", computeRisk],
    ["generateReasoning", generateReasoning],
    ["replayState", replayState],
].forEach(([name, fn]) => {
    if (typeof fn !== "function") {
        console.error(
            `Task 8 setup error: "${name}" did not resolve to a function. ` +
            `Check the export in the corresponding engine file — it may be exporting ` +
            `under a different name, or not exporting yet.`
        );
    }
});

// ---------- Task 11 ----------
const lifecycleRoutes = require("./routes/lifecycleRoutes");
const concurrencyRoutes = require("./routes/concurrencyRoutes");
const enforcementRoutes = require("./routes/enforcementRoutes");
const failureRoutes = require("./routes/failureRoutes");
const observabilityRoutes = require("./routes/observabilityRoutes");
const operationalRoutes = require("./routes/operationalRoutes");
const recoveryService = require("./services/recoveryService");

// ---------- Task 13 ----------
const concurrentRoutes = require("./routes/concurrentRoutes");
const corruptionRoutes = require("./routes/corruptionRoutes");
const lineageRoutes = require("./routes/lineageRoutes");
const fieldRoutes = require("./routes/fieldRoutes");
const stabilityRoutes = require("./routes/stabilityRoutes");
const finalRoutes = require("./routes/finalRoutes");
const phaseRoutes = require("./routes/phaseRoutes");

// ---------- Task 15 ----------
// NOTE: `connectDBTask36` added to this destructure below — config/db.js
// (merged for Task 36) now exports it alongside connectDB/connectDBTask35,
// so it needs to be pulled in here for Task 36's own connectDB() call
// further down to have something valid to invoke.
const { connectDB, db, connectDBTask36 } = require("./config/db");
const authRouteTask15 = require("./routes/auth");
const signalRouteTask15 = require("./routes/signal");
const replayRouteTask15 = require("./routes/replay");
const governanceRouteTask15 = require("./routes/governance");
const telemetryRouteTask15 = require("./routes/telemetry");
const concurrencyRouteTask15 = require("./routes/concurrency");
const corruptionRouteTask15 = require("./routes/corruption");
const validationRouteTask15 = require("./routes/validation");
const demoRouteTask15 = require("./routes/demo");
const lineageRouteTask15 = require("./routes/lineage");
const anomalyRouteTask15 = require("./routes/anomaly");

// ---------- Task 16 ----------
const replayRouteTask16 = replayRouteTask15;

// ---------- Task 17 ----------
const entropyRouteTask17 = require("./routes/entropyRoutes");
const governanceRouteTask17 = require("./routes/governanceRoutes");
const telemetryRouteTask17 = require("./routes/telemetryRoutes");
const replayRouteTask17 = replayRoutes;

// ---------- Task 22 ----------
const escalationRoutesTask22 = require("./routes/escalationRoutes");
const simulationRoutesTask22 = require("./routes/simulationRoutes");
const runtimeRoutesTask22 = require("./routes/runtimeRoutes");
const telemetryRouteTask22 = telemetryRouteTask17;
const replayRouteTask22 = replayRoutes;

// ---------- Task 23 ----------
const operatorRoutesTask23 = require("./routes/operatorRoutes");
const telemetryRouteTask23 = require("./routes/telemetryRoutesTask23");
const escalationRoutesTask23 = require("./routes/escalationRoutesTask23");
const replayRouteTask23 = require("./routes/replayRoutesTask23");
const runtimeRoutesTask23 = require("./routes/runtimeRoutesTask23");

// ---------- Task 24 ----------
const dbTask24 = db;

const createSignalTable = require("./models/Signal");
const createTelemetryTable = require("./models/Telemetry");
const createIncidentTable = require("./models/Incident");
const createAlertTable = require("./models/Alert");
const createRecommendationTable = require("./models/Recommendation");
const createDecisionTable = require("./models/Decision");
const createApprovalTable = require("./models/Approval");
const createEscalationTable = require("./models/Escalation");
const createInterventionTable = require("./models/Intervention");
const createReplayTable = require("./models/Replay");
const createRuntimeTable = require("./models/Runtime");
const createOperatorTable = require("./models/Operator");
const createWorkflowStateTable = require("./models/WorkflowState");
const createSourceTable = require("./models/Source");
const createLocationTable = require("./models/Location");
const createUncertaintyTable = require("./models/Uncertainty");
const createConfidenceTable = require("./models/Confidence");
const createTimelineCheckpointTable = require("./models/TimelineCheckpoint");

const signalRoutesTask24 = require("./routes/signals");
const telemetryRoutesTask24 = telemetryRouteTask15;
const incidentRoutesTask24 = require("./routes/incidents");
const alertRoutesTask24 = require("./routes/alerts");
const runtimeRoutesTask24 = require("./routes/runtime");

// ---------- Task 25 ----------
const escalationRoutesTask25 = require("./routes/escalations");
const operatorRoutesTask25 = require("./routes/operators");
const logRoutesTask25 = require("./routes/logs");
const decisionRoutesTask25 = require("./routes/decisions");
const approvalRoutesTask25 = require("./routes/approvals");
const signalRoutesTask25 = signalRoutesTask24;
const telemetryRouteTask25 = telemetryRouteTask15;
const incidentRoutesTask25 = incidentRoutesTask24;
const replayRouteTask25 = replayRouteTask15;

// ---------- Task 26 ----------
const connectDBTask26 = connectDB;
const TelemetryModelTask26 = createTelemetryTable;
const RuntimeLogModelTask26 = require("./models/RuntimeLog");

// ---------- Task 27 ----------
const mysqlDB = db;
const signalRoutesTask27 = require("./routes/signalRoutes");
const incidentRoutesTask27 = require("./routes/incidentRoutes");
const replayRoutesTask27 = replayRoutes;
const dashboardRoutesTask27 = require("./routes/dashboardRoutes");

// ---------- Task 29 ----------
const dbTask29 = require("./database/db");
const signalRoutesTask29 = signalRoutesTask24;
const telemetryRouteTask29 = telemetryRouteTask15;
const incidentRoutesTask29 = incidentRoutesTask24;
const escalationRoutesTask29 = escalationRoutesTask25;
const decisionRoutesTask29 = decisionRoutesTask25;
const replayRouteTask29 = replayRouteTask15;
const runtimeRoutesTask29 = runtimeRoutesTask24;

// ---------- Task 30 ----------
const floodRoutesTask30 = require("./routes/floodRoutes");

// ---------- Task 31 ----------
const signalRoutesTask31 = require("./signal-adapter/signalRoutes");
const { processSignals } = require("./signal-adapter/signalController");

// ---------- Task 32 ----------
const runtimeRoutesTask32 = require("./routes/runtimeRoutesTask32");
const replayRoutesTask32 = require("./routes/replayRoutesTask32");
const dashboardRoutesTask32 = require("./routes/dashboardRoutesTask32");

// ---------- Task 33 ----------
const dbTask33 = db;
const runtimeRoutesTask33 = require("./routes/runtimeRoutesTask33");
const replayRoutesTask33 = require("./routes/replayRoutesTask33");
const healthRoutesTask33 = require("./routes/healthRoutes");
const commandCenterRoutesTask33 = require("./routes/commandCenterRoutes");

const requestLoggerTask33 = require("./middleware/requestLogger");
const traceMiddlewareTask33 = require("./middleware/traceMiddleware");
const runtimeAuditTask33 = require("./middleware/runtimeAudit");
const notFoundTask33 = require("./middleware/notFound");
const errorHandlerTask33 = require("./middleware/errorHandler");

// ---------- Task 34 ----------
const signalTask34 = require("./routes/signalsTask34");
const telemetryTask34 = require("./routes/telemetryTask34");
const incidentTask34 = require("./routes/incidentsTask34");
const escalationTask34 = require("./routes/escalationsTask34");
const replayTask34 = require("./routes/replayTask34");
const evidenceTask34 = require("./routes/evidence");
const observabilityTask34 = require("./routes/observability");

// ---------- Task 35 ----------
const eventRoutes = require("./routes/eventRoutes");
const traceRoutes = require("./routes/traceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// ---------- Task 36 ----------
const loggerTask36 = require("./middleware/logger");
const traceMiddlewareTask36 = traceMiddlewareTask33;
const errorHandlerTask36 = errorHandlerTask33;

const RuntimeScheduler = require("./runtime/RuntimeScheduler");

const runtimeRoutesTask36 = require("./routes/runtime.routes");
const signalRoutesTask36 = require("./routes/signal.routes");
const telemetryRoutesTask36 = require("./routes/telemetry.routes");
const incidentRoutesTask36 = require("./routes/incident.routes");
const escalationRoutesTask36 = require("./routes/escalation.routes");
const replayRoutesTask36 = require("./routes/replay.routes");
const evidenceRoutesTask36 = require("./routes/evidence.routes");
const analyticsRoutesTask36 = require("./routes/analytics.routes");
const observabilityRoutesTask36 = require("./routes/observability.routes");

// =====================================================
// DATABASE CONNECTION - VERCEL SAFE
// =====================================================

const connectMongo = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error(
            "MONGO_URI is missing. Add MONGO_URI in Vercel Project Settings > Environment Variables."
        );
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (mongoose.connection.readyState === 2) {
        await mongoose.connection.asPromise();
        return mongoose.connection;
    }

    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
    });

    console.log("\u2705 MongoDB Connected");
    console.log(`\ud83d\udce6 Database: ${mongoose.connection.name}`);

    return mongoose.connection;
};

// On normal local Node execution, establish MongoDB once at startup.
// On Vercel, the connection is established lazily by the middleware below
// so each serverless invocation can reuse a warm connection.
if (!process.env.VERCEL) {
    connectMongo().catch((error) => {
        console.error("\u274c MongoDB Connection Failed");
        console.error(error.message);
        process.exit(1);
    });
}

// =====================================================
// TASK 8 MEMORY (REPLAY STORAGE)
// =====================================================

let STATE_HISTORY = [];

// =====================================================
// TASK 11 RECOVERY INITIALIZATION
// =====================================================

recoveryService.initializeRecovery();

// =====================================================
// TASK 24 SCHEMA INITIALIZATION
// =====================================================

createSignalTable();
createTelemetryTable();
createIncidentTable();
createAlertTable();
createRecommendationTable();
createDecisionTable();
createApprovalTable();
createEscalationTable();
createInterventionTable();
createReplayTable();
createRuntimeTable();
createOperatorTable();
createWorkflowStateTable();
createSourceTable();
createLocationTable();
createUncertaintyTable();
createConfidenceTable();
createTimelineCheckpointTable();

console.log("Task 24: UCCIS Schema Initialized");

// =====================================================
// TASK 26 DATABASE SEED
// =====================================================

const seedDatabaseTask26 = async () => {
    const tCount = await TelemetryModelTask26.countDocuments();
    const rCount = await RuntimeLogModelTask26.countDocuments();

    if (tCount === 0) {
        await TelemetryModelTask26.insertMany([
            { signalId: "T1", type: "CPU", value: 70, status: "OK" },
            { signalId: "T2", type: "MEM", value: 55, status: "OK" },
            { signalId: "T3", type: "DISK", value: 40, status: "OK" }
        ]);
        console.log("✅ Telemetry seed inserted");
    }

    if (rCount === 0) {
        await RuntimeLogModelTask26.insertMany([
            { module: "backend", message: "System initialized", level: "INFO" },
            { module: "telemetry", message: "Stream started", level: "INFO" }
        ]);
        console.log("✅ Runtime seed inserted");
    }
};

seedDatabaseTask26().catch((err) => {
    console.error("Task 26 seed error:", err.message);
});

// =====================================================
// TASK 20 — RUNTIME STATE
// =====================================================

let telemetryTask20 = {
    heartbeat: 98,
    entropy: 12,
    incidents: 4,
    operators: 26,
    escalationRisk: "LOW",
    runtimeStatus: "ACTIVE",
    refreshCount: 0,
    lastRefresh: new Date().toISOString()
};

let alertTickerTask20 = [
    { id: 1, message: "Operational replay validated" },
    { id: 2, message: "District telemetry synchronized" },
    { id: 3, message: "Field operator connected" },
    { id: 4, message: "Control center heartbeat stable" },
    { id: 5, message: "Telemetry integrity verified" },
    { id: 6, message: "Runtime polling healthy" },
    { id: 7, message: "Live governance stream active" }
];

let replayStoreTask20 = [
    {
        replayId: 1,
        event: "Signal propagation validated",
        severity: "LOW",
        timestamp: new Date().toISOString()
    },
    {
        replayId: 2,
        event: "Escalation replay checkpoint",
        severity: "MEDIUM",
        timestamp: new Date().toISOString()
    }
];

let acknowledgementQueueTask20 = [
    { id: 1, department: "District Intelligence", status: "WAITING_ACKNOWLEDGEMENT" },
    { id: 2, department: "Operational Logistics", status: "WAITING_ACKNOWLEDGEMENT" },
    { id: 3, department: "Emergency Coordination", status: "WAITING_ACKNOWLEDGEMENT" }
];

let runtimeLogsTask20 = [
    { id: 1, level: "INFO", message: "Runtime initialized", timestamp: new Date().toISOString() },
    { id: 2, level: "INFO", message: "Replay engine online", timestamp: new Date().toISOString() },
    { id: 3, level: "INFO", message: "Telemetry synchronization active", timestamp: new Date().toISOString() }
];

function addRuntimeLogTask20(level, message) {
    runtimeLogsTask20.unshift({
        id: Date.now(),
        level,
        message,
        timestamp: new Date().toISOString()
    });

    if (runtimeLogsTask20.length > 20) {
        runtimeLogsTask20.pop();
    }
}

function addReplayEventTask20(event, severity) {
    replayStoreTask20.unshift({
        replayId: Date.now(),
        event,
        severity,
        timestamp: new Date().toISOString()
    });

    if (replayStoreTask20.length > 20) {
        replayStoreTask20.pop();
    }
}

function addTickerTask20(message) {
    alertTickerTask20.unshift({
        id: Date.now(),
        message
    });

    if (alertTickerTask20.length > 10) {
        alertTickerTask20.pop();
    }
}

setInterval(() => {
    telemetryTask20.refreshCount += 1;
    telemetryTask20.lastRefresh = new Date().toISOString();
    telemetryTask20.heartbeat = 90 + Math.floor(Math.random() * 10);
    telemetryTask20.entropy = 5 + Math.floor(Math.random() * 20);
    telemetryTask20.operators = 20 + Math.floor(Math.random() * 15);
    telemetryTask20.incidents = 1 + Math.floor(Math.random() * 10);

    const runtimeStatesTask20 = ["ACTIVE", "STABLE", "MONITORING"];
    telemetryTask20.runtimeStatus =
        runtimeStatesTask20[Math.floor(Math.random() * runtimeStatesTask20.length)];

    const escalationStatesTask20 = ["LOW", "MEDIUM", "HIGH"];
    telemetryTask20.escalationRisk =
        escalationStatesTask20[Math.floor(Math.random() * escalationStatesTask20.length)];

    addRuntimeLogTask20("INFO", "Runtime telemetry refreshed");
    addTickerTask20("Telemetry integrity verified");
}, 4000);

// =====================================================
// TASK 33 MIDDLEWARE — LOGGING / TRACE / AUDIT
// =====================================================

app.use(requestLoggerTask33);
app.use(traceMiddlewareTask33);
app.use(runtimeAuditTask33);

// =====================================================
// TASK 35 MIDDLEWARE — CORS (credentials) / REQUEST LOGGER
// =====================================================

app.use(
    cors({
        origin: "*",
        credentials: true
    })
);

app.use((req, res, next) => {
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    );
    next();
});

// =====================================================
// TASK 36 MIDDLEWARE — LOGGER
// NOTE: Task 36's own `app.use(cors())`, `app.use(express.json({limit:
// "10mb"}))`, and `app.use(express.urlencoded({extended:true}))` calls are
// skipped as redundant — all three already run once at the top of this
// file with equal-or-greater settings. Its `app.use(traceMiddleware)` call
// is also skipped: traceMiddlewareTask36 is the same function already
// registered above as traceMiddlewareTask33, so registering it again would
// just run the identical middleware twice per request for no benefit.
// `loggerTask36` is a genuinely distinct module from every logger already
// wired in (Task 27's disk logger, Task 33's requestLoggerTask33, Task 35's
// inline console logger), so it's kept as an additional layer below.
// =====================================================

app.use(loggerTask36);

// =====================================================
// TASK 5 ROUTES
// =====================================================

app.use("/api", zoneRoutes);
app.use("/api", executionTask5Routes);
app.use("/api", snapshotRoutes);

// =====================================================
// TASK 3 ROUTES
// =====================================================

app.use("/api", intelligenceRoutes);
app.use("/api/intelligence", intelligenceRoutes);

// =====================================================
// TASK 4 ROUTES
// =====================================================

app.use("/api", intelligenceRoutesTask4);
app.use("/api/intelligence", intelligenceRoutesTask4);

app.use("/", executionRoutes);
app.use("/api", executionRoutes);

// =====================================================
// TASK 6 ROUTES
// =====================================================

app.use("/intelligence", intelligenceRoutes);
app.use("/execute", executionRoutesTask6);
app.use("/memory", memoryRoutes);
app.use("/replay", replayRoutes);

// =====================================================
// TASK 8 ROUTES - INTELLIGENCE ENGINE PIPELINE
// =====================================================

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        time: new Date().toISOString()
    });
});

app.get("/api/intelligence-run", (req, res) => {
    try {

        const normalized = normalizeAll(weather);

        const zones = {};

        normalized.forEach((item) => {
            if (!zones[item.zone_id]) {
                zones[item.zone_id] = [];
            }
            zones[item.zone_id].push(item);
        });

        const risk = computeRisk(normalized);

        const reasoning = generateReasoning(normalized, risk);

        const currentState = {
            final_score: risk?.final_score ?? risk?.score ?? 0,
            influenced_domains: risk?.influenced_domains ?? reasoning?.influenced_domains ?? {},
            timestamp: Date.now(),
            behavior: reasoning?.behavior ?? risk?.behavior ?? "STABLE",
            final_level: risk?.final_level ?? risk?.level ?? "LOW"
        };

        const previousSnapshot = STATE_HISTORY[STATE_HISTORY.length - 1];
        const previousState = previousSnapshot?.currentState ?? null;

        const anomalies = anomalyEngine.detect(currentState, previousState);

        const snapshot = {
            timestamp: new Date().toISOString(),
            zones,
            normalized,
            risk,
            reasoning,
            anomalies,
            currentState
        };

        STATE_HISTORY.push(snapshot);

        res.json({
            success: true,
            snapshot
        });

    } catch (err) {

        console.error("Task 8 /api/intelligence-run error:", err);

        res.status(500).json({
            success: false,
            error: err.message,
            stack: err.stack
        });

    }

});

app.get("/api/replay", (req, res) => {
    res.json(replayState(STATE_HISTORY));
});

// =====================================================
// TASK 14 ROUTES - OPERATIONS DASHBOARD MOCK DATA
// =====================================================

app.get("/api/operations", (req, res) => {
    res.json({
        activeIncidents: 84,
        escalations: 12,
        districts: 36,
        replayEvents: 142,
        operationalStress: "HIGH",
        telemetry: "STABLE"
    });
});

app.get("/api/replay-mock", (req, res) => {
    res.json({
        replayStatus: "ACTIVE",
        timelineEvents: 42,
        divergenceDetected: false
    });
});

app.get("/api/observability", (req, res) => {
    res.json({
        telemetryHealthy: true,
        staleSignals: 2,
        replaySync: "HEALTHY"
    });
});

app.get("/api/governance", (req, res) => {
    res.json({
        governanceStatus: "STABLE",
        policyEscalations: 14,
        budgetUtilization: "78%"
    });
});

// =====================================================
// TASK 11 ROUTES - OPERATIONAL RESILIENCE LAYER
// =====================================================

safeUse("/lifecycle", lifecycleRoutes, "lifecycleRoutes");
safeUse("/concurrency", concurrencyRoutes, "concurrencyRoutes");
safeUse("/enforcement", enforcementRoutes, "enforcementRoutes");
safeUse("/failure", failureRoutes, "failureRoutes");
safeUse("/observability", observabilityRoutes, "observabilityRoutes");
safeUse("/operations", operationalRoutes, "operationalRoutes");

// =====================================================
// TASK 20 ROUTES - RUNTIME COMMAND CENTER
// =====================================================

app.get("/api/runtime/status", (req, res) => {
    res.json({
        runtime: "ACTIVE",
        serverTimestamp: new Date().toISOString(),
        telemetry: telemetryTask20,
        alertTicker: alertTickerTask20,
        replay: replayStoreTask20,
        acknowledgementQueue: acknowledgementQueueTask20,
        runtimeLogs: runtimeLogsTask20
    });
});

app.post("/api/runtime/generate-signal", (req, res) => {
    telemetryTask20.incidents += 1;
    telemetryTask20.entropy += 2;
    telemetryTask20.escalationRisk = "HIGH";

    const signalEvent = `Operational signal generated #${Date.now()}`;

    addReplayEventTask20(signalEvent, "HIGH");
    addRuntimeLogTask20("WARNING", signalEvent);
    addTickerTask20("Emergency escalation generated");

    res.json({
        success: true,
        message: "Signal generated successfully"
    });
});

app.post("/api/runtime/reset", (req, res) => {
    telemetryTask20 = {
        heartbeat: 98,
        entropy: 12,
        incidents: 4,
        operators: 26,
        escalationRisk: "LOW",
        runtimeStatus: "ACTIVE",
        refreshCount: 0,
        lastRefresh: new Date().toISOString()
    };

    addRuntimeLogTask20("INFO", "Runtime reset executed");
    addTickerTask20("System runtime reset completed");

    res.json({
        success: true,
        message: "Runtime reset successful"
    });
});

app.post("/api/runtime/acknowledge/:id", (req, res) => {
    const id = parseInt(req.params.id);

    acknowledgementQueueTask20 = acknowledgementQueueTask20.filter(
        (item) => item.id !== id
    );

    addRuntimeLogTask20("INFO", `Acknowledgement completed for queue ${id}`);
    addTickerTask20("Field acknowledgement received");

    res.json({
        success: true,
        message: "Acknowledgement successful"
    });
});

app.get("/api/phase1", (req, res) => {
    res.json({
        phase: "Phase 1 - Canonical Consolidation",
        runtimeHealth: 96,
        incidents: 4,
        operators: 18,
        threat: "LOW",
        risk: 12,
        repositoriesMerged: 7,
        pendingMigration: 1,
        apiStatus: "CONNECTED",
        runtime: "OPERATIONAL",
        modules: ["backend", "frontend", "replay", "telemetry", "maps"]
    });
});

app.get("/api/phase2", (req, res) => {
    res.json({
        phase: "Phase 2 - Runtime Demonstration",
        runtimeHealth: 91,
        incidents: 7,
        operators: 24,
        threat: "MEDIUM",
        risk: 20,
        operationalChain: "ACTIVE",
        replay: "VERIFIED",
        telemetry: "CONNECTED",
        escalation: "OPERATIONAL",
        auditLogs: "ACTIVE"
    });
});

app.get("/api/phase3", (req, res) => {
    res.json({
        phase: "Phase 3 - Feature Expansion",
        runtimeHealth: 88,
        incidents: 9,
        operators: 34,
        threat: "HIGH",
        risk: 34,
        liveTicker: "ACTIVE",
        operatorFeed: "CONNECTED",
        escalationAging: "RUNNING",
        deploymentLayer: "ACTIVE",
        replayCertainty: "VERIFIED"
    });
});

app.get("/api/phase4", (req, res) => {
    res.json({
        phase: "Phase 4 - Hardening",
        runtimeHealth: 92,
        incidents: 5,
        operators: 22,
        threat: "LOW",
        risk: 16,
        fallbackLayer: "ACTIVE",
        staleTelemetry: "HANDLED",
        polling: "ACTIVE",
        degradedMode: "READY",
        replayValidation: "VERIFIED"
    });
});

app.get("/api/phase5", (req, res) => {
    res.json({
        phase: "Phase 5 - Operational Feel",
        runtimeHealth: 97,
        incidents: 3,
        operators: 38,
        threat: "LOW",
        risk: 8,
        heartbeat: "VISIBLE",
        timestamps: "ACTIVE",
        liveRuntime: "CONNECTED",
        counters: "RUNNING",
        runtimeStreaming: "MOCK_ACTIVE"
    });
});

app.get("/api/phase6", (req, res) => {
    res.json({
        phase: "Phase 6 - Dashboard Maturity",
        runtimeHealth: 95,
        incidents: 2,
        operators: 31,
        threat: "LOW",
        risk: 10,
        gridDensity: "OPTIMIZED",
        cognitionLayer: "ACTIVE",
        echarts: "CONNECTED",
        executivePanels: "ENABLED",
        scanability: "HIGH"
    });
});

app.get("/api/phase7", (req, res) => {
    res.json({
        phase: "Phase 7 - Testability",
        runtimeHealth: 99,
        incidents: 1,
        operators: 12,
        threat: "LOW",
        risk: 4,
        replayTesting: "PASSED",
        telemetryTesting: "PASSED",
        pollingTesting: "PASSED",
        degradedTesting: "PASSED",
        proofMapping: "VERIFIED"
    });
});

app.get("/api/v2/task20/status", (req, res) => {
    res.send("UCCIS Backend Runtime Active");
});

// =====================================================
// TASK 13 ROUTES - REPLAY ENGINE EXTENSIONS
// =====================================================

safeUse("/api/replay", replayRoutes, "replayRoutes (Task 13)");
safeUse("/api/concurrent", concurrentRoutes, "concurrentRoutes");
safeUse("/api/corruption", corruptionRoutes, "corruptionRoutes");
safeUse("/api/lineage", lineageRoutes, "lineageRoutes");
safeUse("/api/enforcement", enforcementRoutes, "enforcementRoutes (Task 13)");
safeUse("/api/field", fieldRoutes, "fieldRoutes");
safeUse("/api/stability", stabilityRoutes, "stabilityRoutes");
safeUse("/api/final", finalRoutes, "finalRoutes");
safeUse("/api", phaseRoutes, "phaseRoutes");

// =====================================================
// TASK 15 ROUTES - GOVERNANCE PLATFORM (MONGO + SOCKET.IO)
// =====================================================

safeUse("/api/v2/auth", authRouteTask15, "authRoute (Task 15)");
safeUse("/api/v2/signal", signalRouteTask15, "signalRoute (Task 15)");
safeUse("/api/v2/replay", replayRouteTask15, "replayRoute (Task 15)");
safeUse("/api/v2/governance", governanceRouteTask15, "governanceRoute (Task 15)");
safeUse("/api/v2/telemetry", telemetryRouteTask15, "telemetryRoute (Task 15)");
safeUse("/api/v2/concurrency", concurrencyRouteTask15, "concurrencyRoute (Task 15)");
safeUse("/api/v2/corruption", corruptionRouteTask15, "corruptionRoute (Task 15)");
safeUse("/api/v2/validation", validationRouteTask15, "validationRoute (Task 15)");
safeUse("/api/v2/demo", demoRouteTask15, "demoRoute (Task 15)");
safeUse("/api/v2/lineage", lineageRouteTask15, "lineageRoute (Task 15)");
safeUse("/api/v2/anomaly", anomalyRouteTask15, "anomalyRoute (Task 15)");

app.get("/api/v2/status", (req, res) => {
    res.json({
        platform: "UCCIS",
        status: "FINAL OPERATIONAL GOVERNANCE PLATFORM ACTIVE",
        replaySafe: true,
        governanceSafe: true,
        telemetryStreaming: true,
        timestamp: new Date().toISOString()
    });
});

// =====================================================
// TASK 16 ROUTES - OPERATIONAL BACKEND
// =====================================================

app.get("/api/v2/task16/status", (req, res) => {
    res.json({
        status: "UCCIS Operational Backend Running"
    });
});

app.get("/api/v2/task16/health", (req, res) => {
    res.json({
        system: "ACTIVE",
        replay: "READY",
        telemetry: "ACTIVE"
    });
});

safeUse("/api/v2/task16/replay", replayRouteTask16, "replayRoute (Task 16)");

// =====================================================
// TASK 17 ROUTES - ENTROPY / GOVERNANCE / TELEMETRY
// =====================================================

safeUse("/api/v2/task17/replay", replayRouteTask17, "replayRoute (Task 17)");
safeUse("/api/entropy", entropyRouteTask17, "entropyRoute (Task 17)");
safeUse("/api/v2/task17/governance", governanceRouteTask17, "governanceRoute (Task 17)");
safeUse("/api/telemetry", telemetryRouteTask23, "telemetryRoute (Task 23)");

app.get("/api/v2/task17/status", (req, res) => {
    res.json({
        message: "UCCIS Backend Running"
    });
});

// =====================================================
// TASK 19 ROUTES - GOVERNANCE COMMAND CENTER (PHASE 1-8)
// =====================================================

app.get("/api/alerts", (req, res) => {
    const alerts = [
        { title: "Flood Escalation Active", severity: "Critical", timestamp: "09:22" },
        { title: "Traffic Density Spike", severity: "High", timestamp: "09:41" },
        { title: "Medical Dispatch Delay", severity: "Medium", timestamp: "10:02" }
    ];

    saveJsonFileTask19("alerts.json", alerts);
    res.json(alerts);
});

app.get("/api/v2/task19/telemetry", (req, res) => {
    const telemetry = [
        { service: "Traffic Grid", district: "Mumbai", health: "Operational", latency: "42ms" },
        { service: "Police Mesh", district: "Thane", health: "Stable", latency: "51ms" },
        { service: "Utility Coordination", district: "MMR", health: "Elevated", latency: "63ms" }
    ];

    saveJsonFileTask19("telemetry.json", telemetry);
    res.json(telemetry);
});

app.get("/api/escalation", (req, res) => {
    const escalation = [
        { district: "Mumbai", risk: 84, trend: "Critical Growth" },
        { district: "Thane", risk: 62, trend: "Stable Trend" },
        { district: "MMR", risk: 71, trend: "Elevated" }
    ];

    saveJsonFileTask19("escalation.json", escalation);
    res.json(escalation);
});

app.get("/api/v2/task19/replay", (req, res) => {
    const replay = [
        { incident: "Flood Reconstruction", confidence: 94, entropy: 12 },
        { incident: "Traffic Replay", confidence: 88, entropy: 17 },
        { incident: "Utility Failure Replay", confidence: 91, entropy: 14 }
    ];

    saveJsonFileTask19("replay.json", replay);
    res.json(replay);
});

app.get("/api/v2/task19/field", (req, res) => {
    const field = [
        { team: "Alpha Team", district: "Mumbai", status: "Deploying" },
        { team: "Bravo Team", district: "Thane", status: "Active" },
        { team: "Medical Unit", district: "MMR", status: "Delayed" }
    ];

    saveJsonFileTask19("field.json", field);
    res.json(field);
});

app.get("/api/v2/task19/governance", (req, res) => {
    const governance = [
        { time: "09:12", action: "Flood escalation routed" },
        { time: "09:28", action: "District review initiated" },
        { time: "09:42", action: "Replay verified" }
    ];

    saveJsonFileTask19("governance.json", governance);
    res.json(governance);
});

app.get("/api/v2/task19/health", (req, res) => {
    const health = {
        operationalHealth: 91,
        systems: [
            { name: "Traffic Grid", status: "Stable" },
            { name: "Replay Engine", status: "Verified" },
            { name: "Governance Layer", status: "Operational" }
        ]
    };

    saveJsonFileTask19("health.json", health);
    res.json(health);
});

app.get("/api/heatmap", (req, res) => {
    const heatmap = [
        { zone: "Mumbai", load: 91 },
        { zone: "Thane", load: 74 },
        { zone: "MMR", load: 82 }
    ];

    saveJsonFileTask19("heatmap.json", heatmap);
    res.json(heatmap);
});

app.get("/api/signals", (req, res) => {
    const signals = [
        {
            signal: "Flood Detection",
            telemetry: "Water Level Rising",
            escalation: "District Escalated",
            replay: "Replay Generated",
            status: "Critical"
        }
    ];

    saveJsonFileTask19("signals.json", signals);
    res.json(signals);
});

app.get("/api/runtime", (req, res) => {
    const runtime = {
        heartbeat: "ACTIVE",
        operators: 247,
        updated: new Date().toLocaleString(),
        uptime: process.uptime()
    };

    saveJsonFileTask19("runtime.json", runtime);
    res.json(runtime);
});

// =====================================================
// TASK 21 ROUTES - RUNTIME LOG VIEWER
// =====================================================

app.get("/api/backend-log", (req, res) => {
    res.json({
        logs: readLogTask21("backend.log")
    });
});

app.get("/api/escalation-log", (req, res) => {
    res.json({
        logs: readLogTask21("escalation.log")
    });
});

app.get("/api/replay-log", (req, res) => {
    res.json({
        logs: readLogTask21("replay.log")
    });
});

app.get("/api/telemetry-log", (req, res) => {
    res.json({
        logs: readLogTask21("telemetry.log")
    });
});

app.get("/api/v2/task21/status", (req, res) => {
    res.send("Backend Running");
});

// =====================================================
// TASK 22 ROUTES
// =====================================================

safeUse("/api/v2/task22/telemetry", telemetryRouteTask22, "telemetryRoutes (Task 22)");
safeUse("/api/escalations", escalationRoutesTask22, "escalationRoutes (Task 22)");
safeUse("/api/v2/task22/replay", replayRouteTask22, "replayRoutes (Task 22)");
safeUse("/api/simulation", simulationRoutesTask22, "simulationRoutes (Task 22)");
safeUse("/api/v2/task22/runtime", runtimeRoutesTask22, "runtimeRoutes (Task 22)");

app.get("/api/v2/task22/status", (req, res) => {
    res.send("UCCIS Backend Running");
});

// =====================================================
// TASK 23 ROUTES
// =====================================================

safeUse("/api/v2/task23/telemetry", telemetryRouteTask23, "telemetryRoutes (Task 23)");
safeUse("/api/v2/task23/escalations", escalationRoutesTask23, "escalationRoutes (Task 23)");
safeUse("/api/v2/task23/replay", replayRouteTask23, "replayRoutes (Task 23)");
safeUse("/api/operators", operatorRoutesTask23, "operatorRoutes (Task 23)");
safeUse("/api/v2/task23/runtime", runtimeRoutesTask23, "runtimeRoutes (Task 23)");

app.get("/api/v2/task23/status", (req, res) => {
    res.json({
        system: "UCCIS Operational Intelligence",
        status: "ACTIVE",
        uptime: process.uptime()
    });
});

// =====================================================
// TASK 24 ROUTES - SQLITE-BACKED SCHEMA + DASHBOARD
// =====================================================

safeUse("/api/signals", signalRoutesTask24, "signalRoutes (Task 24)");
safeUse("/api/v2/task24/telemetry", telemetryRoutesTask24, "telemetryRoutes (Task 24)");
safeUse("/api/incidents", incidentRoutesTask24, "incidentRoutes (Task 24)");
safeUse("/api/v2/task24/alerts", alertRoutesTask24, "alertRoutes (Task 24)");
safeUse("/api/v2/task24/runtime", runtimeRoutesTask24, "runtimeRoutes (Task 24)");

app.get("/api/v2/task24/status", (req, res) => {
    res.json({
        success: true,
        application: "UCCIS",
        version: "1.0.0",
        phase: "Operational Intelligence Convergence"
    });
});

app.get("/api/v2/task24/health", (req, res) => {
    res.json({
        success: true,
        status: "RUNNING",
        timestamp: new Date().toISOString()
    });
});

app.get("/api/dashboard/stats", (req, res) => {
    const stats = {};

    dbTask24.get(
        "SELECT COUNT(*) AS total FROM signals",
        [],
        (e1, s) => {
            stats.signals = s?.total || 0;

            dbTask24.get(
                "SELECT COUNT(*) AS total FROM incidents",
                [],
                (e2, i) => {
                    stats.incidents = i?.total || 0;

                    dbTask24.get(
                        "SELECT COUNT(*) AS total FROM telemetry",
                        [],
                        (e3, t) => {
                            stats.telemetry = t?.total || 0;

                            dbTask24.get(
                                "SELECT COUNT(*) AS total FROM runtimes",
                                [],
                                (e4, r) => {
                                    stats.runtime = r?.total || 0;

                                    res.json({
                                        success: true,
                                        data: stats
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

app.get("/api/datasets/:name", (req, res) => {
    try {
        const datasetName = req.params.name;

        const filePath = path.join(
            process.cwd(),
            "datasets",
            `${datasetName}.json`
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "Dataset not found"
            });
        }

        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        res.json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get("/api/operational-chain", (req, res) => {
    try {
        const filePath = path.join(
            process.cwd(),
            "datasets",
            "operational_chain.json"
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "Operational chain missing"
            });
        }

        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        res.json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get("/api/runtime-logs/:name", (req, res) => {
    try {
        const logName = req.params.name;

        const filePath = path.join(
            process.env.VERCEL ? "/tmp" : process.cwd(),
            "runtime_logs",
            `${logName}.log`
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                logs: "No logs available."
            });
        }

        const logs = fs.readFileSync(filePath, "utf8");

        res.json({
            success: true,
            logName,
            logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get("/api/seed", (req, res) => {
    dbTask24.serialize(() => {
        dbTask24.run(`
      INSERT INTO incidents
      (title,severity,status,created_at)
      VALUES
      ('Traffic Junction Failure','HIGH','OPEN',datetime('now')),
      ('Flood Surge Warning','CRITICAL','OPEN',datetime('now'))
    `);

        dbTask24.run(`
      INSERT INTO runtimes
      (service_name,status,updated_at)
      VALUES
      ('Backend Service','RUNNING',datetime('now')),
      ('Telemetry Engine','RUNNING',datetime('now')),
      ('Replay Engine','RUNNING',datetime('now'))
    `);
    });

    res.json({
        success: true,
        message: "Seed completed"
    });
});

// =====================================================
// TASK 25 ROUTES - SQLITE-BACKED OPERATIONAL MODULES
// =====================================================

safeUse("/api/v2/task25/signals", signalRoutesTask25, "signalRoutes (Task 25)");
safeUse("/api/v2/task25/telemetry", telemetryRouteTask25, "telemetryRoute (Task 25)");
safeUse("/api/v2/task25/incidents", incidentRoutesTask25, "incidentRoutes (Task 25)");
safeUse("/api/v2/task25/escalations", escalationRoutesTask25, "escalationRoutes (Task 25)");
safeUse("/api/v2/task25/operators", operatorRoutesTask25, "operatorRoutes (Task 25)");
safeUse("/api/v2/task25/replay", replayRouteTask25, "replayRoute (Task 25)");
safeUse("/api/logs", logRoutesTask25, "logRoutes (Task 25)");
safeUse("/api/decisions", decisionRoutesTask25, "decisionRoutes (Task 25)");
safeUse("/api/approvals", approvalRoutesTask25, "approvalRoutes (Task 25)");

app.get("/api/v2/task25/status", (req, res) => {
    res.status(200).json({
        system: "UCCIS",
        version: "1.0.0",
        status: "RUNNING",
        timestamp: new Date().toISOString(),
        runtime: {
            backend: "ONLINE",
            telemetry: "ACTIVE",
            replay: "ACTIVE",
            escalation: "ACTIVE",
            database: "CONNECTED"
        }
    });
});

app.get("/api/v2/task25/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "UCCIS Backend",
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

app.get("/system-info", (req, res) => {
    res.json({
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
    });
});

app.get("/api/v2/task25/endpoints", (req, res) => {
    res.json({
        endpoints: [
            "/api/v2/task25/signals",
            "/api/v2/task25/telemetry",
            "/api/v2/task25/incidents",
            "/api/v2/task25/escalations",
            "/api/v2/task25/operators",
            "/api/v2/task25/replay",
            "/api/logs",
            "/api/decisions",
            "/api/approvals"
        ]
    });
});

// =====================================================
// TASK 26 ROUTES - MONGOOSE TELEMETRY / RUNTIME LOG API
// =====================================================

app.get("/api/v2/task26/telemetry", async (req, res) => {
    const data = await TelemetryModelTask26.find().sort({ timestamp: -1 });
    res.json(data);
});

app.post("/api/v2/task26/telemetry", async (req, res) => {
    const data = await TelemetryModelTask26.create(req.body);
    res.json(data);
});

app.get("/api/v2/task26/runtime", async (req, res) => {
    const logs = await RuntimeLogModelTask26.find().sort({ timestamp: -1 });
    res.json(logs);
});

app.post("/api/v2/task26/runtime", async (req, res) => {
    const log = await RuntimeLogModelTask26.create(req.body);
    res.json(log);
});

app.get("/api/v2/task26/status", (req, res) => {
    res.send("UCCIS Backend Running 🚀");
});

// =====================================================
// TASK 27 ROUTES - SIGNAL / INCIDENT / REPLAY / DASHBOARD API
// =====================================================

safeUse("/api/v2/task27/signals", signalRoutesTask27, "signalRoutes (Task 27)");
safeUse("/api/v2/task27/incidents", incidentRoutesTask27, "incidentRoutes (Task 27)");
safeUse("/api/v2/task27/replay", replayRoutesTask27, "replayRoutes (Task 27)");
safeUse("/api/v2/task27/dashboard", dashboardRoutesTask27, "dashboardRoutes (Task 27)");

app.get("/api/health/db", async (req, res) => {
    try {
        const [rows] = await mysqlDB.query("SELECT NOW() AS databaseTime");

        res.status(200).json({
            success: true,
            database: "CONNECTED",
            time: rows[0].databaseTime
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            database: "DISCONNECTED",
            error: error.message
        });
    }
});

app.get("/api/runtime/summary", async (req, res) => {
    try {
        const [signals] = await mysqlDB.query("SELECT COUNT(*) total FROM signals");
        const [events] = await mysqlDB.query("SELECT COUNT(*) total FROM telemetry_events");
        const [incidents] = await mysqlDB.query("SELECT COUNT(*) total FROM incidents");
        const [escalations] = await mysqlDB.query("SELECT COUNT(*) total FROM escalations");
        const [replays] = await mysqlDB.query("SELECT COUNT(*) total FROM replay_sessions");
        const [logs] = await mysqlDB.query("SELECT COUNT(*) total FROM runtime_logs");

        res.json({
            signals: signals[0].total,
            telemetryEvents: events[0].total,
            incidents: incidents[0].total,
            escalations: escalations[0].total,
            replaySessions: replays[0].total,
            runtimeLogs: logs[0].total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get("/api/runtime/chain", async (req, res) => {
    try {
        const [rows] = await mysqlDB.query(`
          SELECT

          s.signal_id,
          s.signal_type,

          l.district,
          l.state,

          t.event_id,
          t.event_status,

          i.incident_id,
          i.severity,

          e.escalation_id,
          e.escalated_to,

          d.decision_text,

          a.approved_by,

          r.replay_result,

          rl.log_message

          FROM signals s

          LEFT JOIN locations l
          ON s.location_id = l.location_id

          LEFT JOIN telemetry_events t
          ON s.signal_id = t.signal_id

          LEFT JOIN incidents i
          ON t.event_id = i.event_id

          LEFT JOIN escalations e
          ON i.incident_id = e.incident_id

          LEFT JOIN decisions d
          ON e.escalation_id = d.escalation_id

          LEFT JOIN approvals a
          ON d.decision_id = a.decision_id

          LEFT JOIN replay_sessions r
          ON i.incident_id = r.incident_id

          LEFT JOIN runtime_logs rl
          ON r.replay_id = rl.replay_id

          ORDER BY s.signal_id DESC
        `);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get("/api/v2/task27/status", (req, res) => {
    res.status(200).json({
        application: "UCCIS Runtime Engine",
        state: "WORKING",
        convergence: "PARTIALLY_CONVERGED",
        status: "RUNNING",
        timestamp: new Date()
    });
});

// =====================================================
// TASK 29 ROUTES - UCCIS COMMAND CENTER SUMMARY API
// =====================================================

safeUse("/api/v2/task29/signals", signalRoutesTask29, "signalRoutes (Task 29)");
safeUse("/api/v2/task29/telemetry", telemetryRouteTask29, "telemetryRoute (Task 29)");
safeUse("/api/v2/task29/incidents", incidentRoutesTask29, "incidentRoutes (Task 29)");
safeUse("/api/v2/task29/escalations", escalationRoutesTask29, "escalationRoutes (Task 29)");
safeUse("/api/v2/task29/decisions", decisionRoutesTask29, "decisionRoutes (Task 29)");
safeUse("/api/v2/task29/replay", replayRouteTask29, "replayRoute (Task 29)");
safeUse("/api/v2/task29/runtime", runtimeRoutesTask29, "runtimeRoutes (Task 29)");

app.get("/api/v2/task29/status", (req, res) => {
    res.json({
        system: "UCCIS",
        status: "ONLINE",
        database: "CONNECTED",
        runtime: "ACTIVE",
        timestamp: new Date()
    });
});

app.get("/api/v2/task29/health", (req, res) => {
    res.json({
        success: true,
        server: "RUNNING",
        database: "CONNECTED",
        runtimeEngine: "ACTIVE",
        timestamp: new Date()
    });
});

app.get("/api/dashboard", (req, res) => {
    const queryTask29 = `
    SELECT
      (SELECT COUNT(*) FROM signals) AS signals,
      (SELECT COUNT(*) FROM telemetry_events) AS telemetry,
      (SELECT COUNT(*) FROM incidents) AS incidents,
      (SELECT COUNT(*) FROM escalations) AS escalations,
      (SELECT COUNT(*) FROM decisions) AS decisions,
      (SELECT COUNT(*) FROM replay_sessions) AS replays,
      (SELECT COUNT(*) FROM runtime_logs) AS runtimeLogs
  `;

    dbTask29.query(queryTask29, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, summary: result[0] });
    });
});

app.get("/api/demo-status", (req, res) => {
    res.json({
        backend: "ONLINE",
        database: "CONNECTED",
        runtimeEngine: "ACTIVE",
        scenarios: [
            "Flood Emergency",
            "Traffic Incident",
            "Medical Emergency",
            "Power Failure",
            "Cyber Incident"
        ],
        sprintStatus: [
            "Database Engineering",
            "Relationship Validation",
            "Runtime Engine",
            "TTG Dataset",
            "Master DB Validation",
            "Demo Chain",
            "Runtime Proof"
        ]
    });
});

app.get("/api/latest-signals", (req, res) => {
    dbTask29.query("SELECT * FROM signals LIMIT 20", (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, count: result.length, data: result });
    });
});

app.get("/api/latest-incidents", (req, res) => {
    dbTask29.query("SELECT * FROM incidents LIMIT 20", (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, count: result.length, data: result });
    });
});

app.get("/api/latest-runtime", (req, res) => {
    dbTask29.query("SELECT * FROM runtime_logs LIMIT 20", (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, count: result.length, data: result });
    });
});

// =====================================================
// TASK 30 ROUTES - FLOOD RESPONSE API
// =====================================================

safeUse("/api", floodRoutesTask30, "floodRoutes (Task 30)");

app.get("/api/flood/execute", (req, res) => {
    res.json({
        success: true,
        message: "Flood endpoint is working",
        note: "Use POST method for real execution"
    });
});

app.get("/api/v2/task30/status", (req, res) => {
    res.json({
        status: "UCCIS RUNNING"
    });
});

// =====================================================
// TASK 31 ROUTES - SIGNAL INTEGRATION LAYER
// =====================================================

safeUse("/api/v2/task31/signals", signalRoutesTask31, "signalRoutes (Task 31)");

app.get("/api/runtime/run-signals", async (req, res) => {
    try {
        const result = await processSignals();
        res.json({
            success: true,
            message: "Signal-driven runtime executed",
            data: result
        });
    } catch (err) {
        console.error("Runtime error:", err.message);
        res.status(500).json({
            success: false,
            message: "Runtime execution failed",
            error: err.message
        });
    }
});

app.get("/api/v2/task31/health", (req, res) => {
    res.json({
        status: "ONLINE",
        system: "UCCIS BACKEND",
        runtime: "ACTIVE",
        signal_layer: "INTEGRATED"
    });
});

// =====================================================
// TASK 32 ROUTES - RUNTIME CHAIN ENGINE
// =====================================================

safeUse("/api/v2/task32/runtime", runtimeRoutesTask32, "runtimeRoutes (Task 32)");
safeUse("/api/v2/task32/replay", replayRoutesTask32, "replayRoutes (Task 32)");
safeUse("/api/v2/task32/dashboard", dashboardRoutesTask32, "dashboardRoutes (Task 32)");

app.get("/api/v2/task32/status", (req, res) => {
    res.status(200).json({
        success: true,
        service: "UCCIS Runtime Chain Engine",
        version: "1.0.0",
        status: "RUNNING",
        endpoints: [
            "/api/v2/task32/runtime",
            "/api/v2/task32/replay",
            "/api/v2/task32/dashboard"
        ]
    });
});

// =====================================================
// TASK 33 ROUTES - RUNTIME COMMAND CENTER
// =====================================================

safeUse("/api/v2/task33/runtime", runtimeRoutesTask33, "runtimeRoutes (Task 33)");
safeUse("/api/v2/task33/replay", replayRoutesTask33, "replayRoutes (Task 33)");
safeUse("/api/v2/task33/health", healthRoutesTask33, "healthRoutes (Task 33)");
safeUse("/api/command-center", commandCenterRoutesTask33, "commandCenterRoutes (Task 33)");

app.get("/api/system/info", async (req, res) => {
    try {
        const stats = await dbTask33.getDatabaseStats();

        res.json({
            success: true,
            application: "UCCIS Runtime Command Center",
            nodeVersion: process.version,
            platform: process.platform,
            uptime: process.uptime(),
            database: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get("/api/system/database", async (req, res) => {
    try {
        const result = await dbTask33.checkDatabaseHealth();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get("/api/system/runtime", (req, res) => {
    try {
        const memory = process.memoryUsage();

        res.json({
            success: true,
            uptime: process.uptime(),
            memory: {
                rss: memory.rss,
                heapTotal: memory.heapTotal,
                heapUsed: memory.heapUsed
            },
            cpu: process.cpuUsage(),
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get("/api/v2/task33/status", (req, res) => {
    res.status(200).json({
        success: true,
        application: "UCCIS Runtime Command Center",
        version: "1.0.0",
        status: "RUNNING",
        database: process.env.DB_NAME,
        timestamp: new Date()
    });
});

app.get("/favicon.ico", (req, res) => {
    return res.status(204).end();
});

/*
=========================================
TASK 34 ROUTES
=========================================
*/

app.use("/api/signals", signalTask34);
app.use("/api/telemetry", telemetryTask34);
app.use("/api/incidents", incidentTask34);
app.use("/api/escalations", escalationTask34);
app.use("/api/replay", replayTask34);
app.use("/api/evidenceTask34", evidenceTask34);
app.use("/api/observability", observabilityTask34);

/*
=========================================
TASK 34 DASHBOARD API
=========================================
*/

app.get("/api/dashboard", (req, res) => {
  res.json({
    signals: 12,
    telemetry: 25,
    incidents: 10,
    escalations: 12,
    replay: 18,
    evidence: 32
  });
});

// =====================================================
// TASK 35 ROUTES - EVENT / TRACE / ANALYTICS API
// =====================================================

app.use("/api/events", eventRoutes);
app.use("/api/traces", traceRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/v2/task35/status", (req, res) => {
    res.json({
        platform: "UCCIS",
        status: "RUNNING",
        phase: "Runtime Scale-Up",
        timestamp: new Date()
    });
});

app.get("/api/v2/task35/health", (req, res) => {
    res.json({
        status: "UP",
        database:
            mongoose.connection.readyState === 1
                ? "CONNECTED"
                : "DISCONNECTED",
        uptime: process.uptime(),
        timestamp: new Date()
    });
});

// =====================================================
// TASK 36 ROUTES - PRODUCTION RUNTIME API
// NOTE: Task 36's own "GET /" root JSON status route would, if left at
// the exact "/" path, register BEFORE the frontend's "GET /" further
// below and permanently shadow it (Express uses first match). Moved to
// "/api/v2/task36/status" instead.
//
// "/api/runtime" is already claimed by Task 19's exact GET route plus
// Task 20/22/23/24/27/31/32/33's various subpaths — mounted under
// "/api/v2/task36/runtime" instead. "/api/signals" is already claimed by
// Task 24 and Task 34 — mounted under "/api/v2/task36/signals". "/api/
// telemetry" is already claimed by Task 17/Task 34 — mounted under
// "/api/v2/task36/telemetry". "/api/incidents" is already claimed by
// Task 24/Task 34 — mounted under "/api/v2/task36/incidents". "/api/
// escalations" is already claimed by Task 22/Task 34 — mounted under
// "/api/v2/task36/escalations". "/api/replay" is already claimed by
// Task 8/13/34 — mounted under "/api/v2/task36/replay". "/api/analytics"
// is already claimed by Task 35 — mounted under "/api/v2/task36/
// analytics". "/api/observability" is already claimed by Task 14's exact
// GET route and Task 34's router — mounted under "/api/v2/task36/
// observability".
//
// "/api/evidence" (singular, no "Task34" suffix) has genuinely no prior
// claim anywhere above — Task 34 used "/api/evidenceTask34" for its own
// router specifically to dodge a collision, leaving plain "/api/evidence"
// free — so Task 36's evidence router keeps its original path.
//
// Task 36's own "GET /api/health" would be shadowed by Task 8's
// earlier-registered exact "/api/health" route — moved to
// "/api/v2/task36/health". "GET /api/runtime-metrics" is a literal path
// with no prior claim anywhere above and keeps its original path.
// =====================================================

safeUse("/api/v2/task36/runtime", runtimeRoutesTask36, "runtimeRoutes (Task 36)");
safeUse("/api/v2/task36/signals", signalRoutesTask36, "signalRoutes (Task 36)");
safeUse("/api/v2/task36/telemetry", telemetryRoutesTask36, "telemetryRoutes (Task 36)");
safeUse("/api/v2/task36/incidents", incidentRoutesTask36, "incidentRoutes (Task 36)");
safeUse("/api/v2/task36/escalations", escalationRoutesTask36, "escalationRoutes (Task 36)");
safeUse("/api/v2/task36/replay", replayRoutesTask36, "replayRoutes (Task 36)");
safeUse("/api/evidence", evidenceRoutesTask36, "evidenceRoutes (Task 36)");
safeUse("/api/v2/task36/analytics", analyticsRoutesTask36, "analyticsRoutes (Task 36)");
safeUse("/api/v2/task36/observability", observabilityRoutesTask36, "observabilityRoutes (Task 36)");

app.get("/api/v2/task36/status", (req, res) => {
    res.status(200).json({
        application: "UCCIS",
        version: "Phase-IV",
        status: "Running",
        timestamp: new Date()
    });
});

app.get("/api/v2/task36/health", async (req, res) => {
    try {
        const dbStatus =
            mongoose.connection.readyState === 1
                ? "Connected"
                : "Disconnected";

        res.status(200).json({
            service: "UCCIS Runtime Engine",
            status: "Healthy",
            database: dbStatus,
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message
        });
    }
});

app.get("/api/runtime-metrics", (req, res) => {
    res.status(200).json({
        runtimeHealth: 98,
        activeSignals: 124,
        activeIncidents: 17,
        escalations: 6,
        replayCount: 83,
        evidenceRecords: 212,
        throughput: 550,
        latency: 118,
        errors: 1,
        serviceStatus: "Healthy",
        dependencyStatus: "Healthy",
        timestamp: new Date()
    });
});

// Task 36's own 404 handler and global error handler are skipped as
// redundant: Task 24's catch-all 404 and Task 15's global error handler
// (both registered further below, after ALL routes) already cover this.
// Its own `app.listen(PORT)` and `const PORT = process.env.PORT || 5000`
// are skipped too: PORT is already declared once further below, and the
// shared http+Socket.IO `server.listen(...)` already handles startup — a
// second app.listen would try to bind the same port twice and crash the
// process.

// =====================================================
// TASK 37 ROUTES - RUNTIME STARTUP DIAGNOSTICS
// NOTE: Task 37's own file was purely a startup/lifecycle wrapper (DB
// connect, listen, process-event handlers) — it didn't define any new
// route handlers of its own, so there is no route section to add here.
// =====================================================

// =====================================================
// TASK 38 ROUTES - WEBSOCKET TELEMETRY + MOCK INCIDENTS/ESCALATIONS
// =====================================================

// Task 38: Telemetry generator for WebSocket streaming
function generateTelemetry() {
    return {
        timestamp: Date.now(),
        cpu: +(30 + Math.random() * 50).toFixed(2),
        memory: +(40 + Math.random() * 40).toFixed(2),
        latency: +(10 + Math.random() * 120).toFixed(2),
        rps: Math.floor(100 + Math.random() * 900),
        errors: Math.floor(Math.random() * 5)
    };
}

// Task 38: Mock incidents endpoint (new — complementary to existing /api/incidents from Task 24)
app.get("/api/v2/task38/incidents", (req, res) => {
    res.json([
        { id: "INC-1001", status: "Open", priority: "High", timestamp: new Date().toISOString() },
        { id: "INC-1002", status: "Closed", priority: "Critical", timestamp: new Date().toISOString() }
    ]);
});

// Task 38: Mock escalations endpoint (new — complementary to existing /api/escalations from Task 22/25)
app.get("/api/v2/task38/escalations", (req, res) => {
    res.json([
        { id: "ESC-01", level: "L1", status: "Active", timestamp: new Date().toISOString() },
        { id: "ESC-02", level: "L2", status: "Resolved", timestamp: new Date().toISOString() }
    ]);
});

// Task 38: Task status
app.get("/api/v2/task38/status", (req, res) => {
    res.status(200).json({
        application: "UCCIS",
        task: "Task 38 - WebSocket Telemetry",
        version: "1.0.0",
        status: "RUNNING",
        websocket: "ACTIVE",
        mockAPIs: ["incidents", "escalations"],
        timestamp: new Date()
    });
});

// Task 38: Health check
app.get("/api/v2/task38/health", (req, res) => {
    res.json({
        status: "UP",
        service: "UCCIS WebSocket Telemetry Service",
        websocket: "Connected",
        uptime: process.uptime(),
        timestamp: new Date()
    });
});

// =====================================================
// FRONTEND
// =====================================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// =====================================================
// TASK 2 DATA
// =====================================================

const task2Zones = [
    {
        id: "zone_1",
        name: "Zone 1",
        traffic_density: 30,
        violation_count: 2,
        congestion_level: "LOW",
        trend: "stable"
    },
    {
        id: "zone_2",
        name: "Zone 2",
        traffic_density: 55,
        violation_count: 5,
        congestion_level: "MEDIUM",
        trend: "stable"
    },
    {
        id: "zone_3",
        name: "Zone 3",
        traffic_density: 68,
        violation_count: 9,
        congestion_level: "MEDIUM",
        trend: "increasing"
    },
    {
        id: "zone_4",
        name: "Zone 4",
        traffic_density: 82,
        violation_count: 15,
        congestion_level: "HIGH",
        trend: "increasing"
    },
    {
        id: "zone_5",
        name: "Zone 5",
        traffic_density: 75,
        violation_count: 12,
        congestion_level: "HIGH",
        trend: "increasing"
    }
];

// =====================================================
// TASK 2 STATUS
// =====================================================

task2Zones.forEach(zone => {

    if (zone.traffic_density > 70 || zone.violation_count > 10)
        zone.status = "RED";
    else if (zone.traffic_density > 50)
        zone.status = "YELLOW";
    else
        zone.status = "GREEN";

    zone.alerts = [];

    if (zone.traffic_density > 70)
        zone.alerts.push("HIGH_TRAFFIC");

    if (zone.violation_count > 10)
        zone.alerts.push("HIGH_VIOLATIONS");

    if (zone.congestion_level === "HIGH")
        zone.alerts.push("HIGH_CONGESTION");

});

// =====================================================
// FILE HELPERS
// =====================================================

const zonesFile = path.join(__dirname, "data", "zones.json");
const alertsFile = path.join(__dirname, "data", "alerts.json");

function readJSON(file) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// =====================================================
// TASK 1 APIs
// =====================================================

app.get("/zone/state", (req, res) => {

    try {

        const zones = readJSON(zonesFile);
        res.json(zones);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

app.get("/alerts", (req, res) => {

    try {

        const alerts = readJSON(alertsFile);
        res.json(alerts);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

app.post("/action/trigger", (req, res) => {

    try {

        let zones = readJSON(zonesFile);
        let alerts = readJSON(alertsFile);

        let { zoneId, action } = req.body;

        zoneId = Number(zoneId);

        let severity = "LOW";

        zones = zones.map(zone => {

            if (zone.id === zoneId) {

                switch (action) {

                    case "deploy_waste_collection":
                        zone.metrics.load -= 20;
                        break;

                    case "reroute_water":
                        zone.metrics.load -= 15;
                        break;

                    case "send_field_team":
                        zone.metrics.load -= 25;
                        break;
                }

                if (zone.metrics.load < 0)
                    zone.metrics.load = 0;

                if (zone.metrics.load >= 70) {
                    zone.status = "RED";
                    severity = "CRITICAL";
                }
                else if (zone.metrics.load >= 40) {
                    zone.status = "YELLOW";
                    severity = "HIGH";
                }
                else {
                    zone.status = "GREEN";
                    severity = "MEDIUM";
                }
            }

            return zone;

        });

        alerts.push({
            id: Date.now(),
            type: action,
            severity,
            zoneId,
            timestamp: new Date().toLocaleString()
        });

        writeJSON(zonesFile, zones);
        writeJSON(alertsFile, alerts);

        res.json({
            success: true,
            message: "Action Executed Successfully",
            zones
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// =====================================================
// TASK 2 APIs
// =====================================================

app.get("/zones", (req, res) => {
    res.json(task2Zones);
});

app.get("/zones/local", (req, res) => {
    res.json(task2Zones);
});

app.get("/zones/:id", (req, res) => {

    const zone = task2Zones.find(z => z.id === req.params.id);

    if (!zone) {
        return res.status(404).json({
            success: false,
            message: "Zone not found"
        });
    }

    res.json(zone);

});

// =====================================================
// HEALTH
// =====================================================

app.get("/health", (req, res) => {

    res.json({
        success: true,
        server: "UCCIS",
        status: "Running"
    });

});

// =====================================================
// TEST PAGE
// =====================================================

app.get("/test", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "test.html"));
});

// =====================================================
// TASK 24 404 HANDLER
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// =====================================================
// TASK 15 GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: "Internal Server Error"
    });
});

// =====================================================
// TASK 36 RUNTIME SCHEDULER
// NOTE: genuinely new — nothing above starts a scheduler. Started here,
// right before the shared server begins listening, mirroring where
// Task 36's own file kicked it off (just before app.listen).
// =====================================================

if (!process.env.VERCEL) {
    RuntimeScheduler.start();
}

// =====================================================
// SERVER (Task 15: HTTP server + Socket.IO + Task 38: WebSocket)
// =====================================================

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.IO and raw WebSocket require a persistent Node server.
// Vercel serverless functions do not provide that model, so realtime
// transports are enabled only for local/traditional Node execution.
let io = null;
let wss = null;

if (!process.env.VERCEL) {
    // Task 15: Socket.IO
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {

    console.log("Operator Connected:", socket.id);

    const telemetryInterval = setInterval(() => {

        socket.emit("telemetry", {
            cpu: Math.floor(Math.random() * 100),
            replayLoad: Math.floor(Math.random() * 100),
            operators: Math.floor(Math.random() * 20),
            governanceIntegrity: Math.floor(Math.random() * 100),
            replayConfidence: Math.floor(Math.random() * 100),
            timestamp: new Date().toISOString()
        });

    }, 2000);

    socket.on("operator-action", (data) => {

        console.log("Operator Action:", data);

        io.emit("operator-update", {
            acknowledged: true,
            action: data,
            timestamp: new Date().toISOString()
        });

    });

    socket.on("replay-request", () => {

        socket.emit("replay-response", {
            replaySafe: true,
            lineageVerified: true,
            reconstruction: "DETERMINISTIC",
            timestamp: new Date().toISOString()
        });

    });

    socket.on("disconnect", () => {
        console.log("Operator Disconnected:", socket.id);
        clearInterval(telemetryInterval);
    });

    });
}

if (!process.env.VERCEL) {
    // Task 38: WebSocket server
    wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("⚡ WebSocket client connected");

    const telemetryInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(generateTelemetry()));
        }
    }, 1000);

    ws.on("close", () => {
        clearInterval(telemetryInterval);
        console.log("❌ WebSocket client disconnected");
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error.message);
    });
    });
}

if (!process.env.VERCEL) {
server.listen(PORT, () => {

    console.log("======================================");
    console.log("      UCCIS Backend Started");
    console.log("======================================");
    console.log(`Server : http://localhost:${PORT}`);
    console.log("Task 1 APIs Loaded");
    console.log("Task 2 APIs Loaded");
    console.log("Task 3 Intelligence APIs Loaded");
    console.log("Task 4 Execution APIs Loaded");
    console.log("Task 5 Zone APIs Loaded");
    console.log("Task 6 Intelligence Engine Loaded");
    console.log("Task 8 Intelligence Pipeline Loaded");
    console.log("Task 11 Operational Resilience Layer Loaded");
    console.log("Task 13 Replay Engine Extensions Loaded");
    console.log("Task 14 Operations Dashboard Mock Data Loaded");
    console.log("Task 15 Governance Platform (Mongo + Socket.IO) Loaded");
    console.log("Task 16 Operational Backend Loaded");
    console.log("Task 17 Entropy / Governance / Telemetry Routes Loaded");
    console.log("Task 19 Governance Command Center Loaded");
    console.log("Task 20 Runtime Command Center Loaded");
    console.log("Task 21 Runtime Log Viewer Loaded");
    console.log("Task 22 Routes Loaded");
    console.log("Task 23 Routes Loaded");
    console.log("Task 24 Schema + Dashboard Routes Loaded");
    console.log("Task 25 SQLite-Backed Operational Modules Loaded");
    console.log("Task 26 Mongoose Telemetry / Runtime Log API Loaded");
    console.log("Task 27 Signal / Incident / Replay / Dashboard API Loaded");
    console.log("Task 29 UCCIS Command Center Summary API Loaded");
    console.log("Task 30 Flood Response API Loaded");
    console.log("Task 31 Signal Integration Layer Loaded");
    console.log("Task 32 Runtime Chain Engine Loaded");
    console.log("Task 33 Runtime Command Center Loaded");
    console.log("Task 35 Event / Trace / Analytics API Loaded");
    console.log("Task 36 Production Runtime API Loaded");
    console.log("Task 37 Production Runtime Bootstrap Loaded");
    console.log("Task 38 WebSocket Telemetry + Mock APIs Loaded");
    console.log(`Health : http://localhost:${PORT}/health`);
    console.log(`Task 8 Health : http://localhost:${PORT}/api/health`);
    console.log(`Task 15 Status : http://localhost:${PORT}/api/v2/status`);
    console.log(`Task 16 Status : http://localhost:${PORT}/api/v2/task16/status`);
    console.log(`Task 17 Status : http://localhost:${PORT}/api/v2/task17/status`);
    console.log(`Task 19 Health : http://localhost:${PORT}/api/v2/task19/health`);
    console.log(`Task 20 Status : http://localhost:${PORT}/api/v2/task20/status`);
    console.log(`Task 21 Status : http://localhost:${PORT}/api/v2/task21/status`);
    console.log(`Task 22 Status : http://localhost:${PORT}/api/v2/task22/status`);
    console.log(`Task 23 Status : http://localhost:${PORT}/api/v2/task23/status`);
    console.log(`Task 24 Status : http://localhost:${PORT}/api/v2/task24/status`);
    console.log(`Task 25 Status : http://localhost:${PORT}/api/v2/task25/status`);
    console.log(`Task 26 Status : http://localhost:${PORT}/api/v2/task26/status`);
    console.log(`Task 27 Status : http://localhost:${PORT}/api/v2/task27/status`);
    console.log(`Task 29 Status : http://localhost:${PORT}/api/v2/task29/status`);
    console.log(`Task 30 Status : http://localhost:${PORT}/api/v2/task30/status`);
    console.log(`Task 31 Health : http://localhost:${PORT}/api/v2/task31/health`);
    console.log(`Task 32 Status : http://localhost:${PORT}/api/v2/task32/status`);
    console.log(`Task 33 Status : http://localhost:${PORT}/api/v2/task33/status`);
    console.log(`Task 35 Status : http://localhost:${PORT}/api/v2/task35/status`);
    console.log(`Task 36 Status : http://localhost:${PORT}/api/v2/task36/status`);
    console.log(`Task 38 Status : http://localhost:${PORT}/api/v2/task38/status`);
    console.log(`Test UI : http://localhost:${PORT}/test`);
    console.log("Socket.IO : ACTIVE");
    console.log("WebSocket : ACTIVE");
    console.log("======================================");

});
}

// =====================================================
// TASK 33 GRACEFUL SHUTDOWN
// NOTE: Task 37's own SIGINT/SIGTERM handlers just did
// `await mongoose.connection.close(); process.exit(0);`. Registering
// those as a SECOND pair of listeners alongside Task 33's shutdownTask33
// (already bound to the same two signals just below) would race against
// it — whichever listener's process.exit() fires first can cut the other
// one off mid-async-cleanup, so the outcome would depend on timing. Since
// mongoose.connection.close() is genuinely new cleanup work Task 33's own
// handler didn't do, it's folded directly into shutdownTask33 instead of
// being a second competing handler.
// =====================================================

const shutdownTask33 = async () => {

    console.log("\n🛑 Shutting Down...");

    server.close(async () => {

        try {

            await dbTask33.promise().end();

            // Task 37: also close the Mongo connection on graceful shutdown.
            await mongoose.connection.close();

            console.log("✅ Database Closed");
            console.log("✅ Server Stopped");

            process.exit(0);

        } catch (error) {

            console.error(error.message);

            process.exit(1);

        }

    });

};

if (!process.env.VERCEL) {
    process.on("SIGINT", shutdownTask33);
    process.on("SIGTERM", shutdownTask33);
}

// =====================================================
// TASK 37 PROCESS-LEVEL SAFETY NETS
// NOTE: genuinely new — nothing above listens for these two events, so
// both are added as-is, mirroring Task 37's own handlers.
// =====================================================

process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection");
    console.error(error);

    if (!process.env.VERCEL) {
        server.close(() => process.exit(1));
    }
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception");
    console.error(error);

    process.exit(1);
});

module.exports = app;