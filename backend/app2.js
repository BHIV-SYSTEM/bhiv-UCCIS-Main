// =====================================================
// app.js
// UCCIS TANTRA CONVERGENCE SYSTEM
// =====================================================

const express = require("express");
const cors = require("cors");

// =====================================================
// MIDDLEWARE
// =====================================================

const logger = require("./middleware/logger");
const requestTracker = require("./middleware/requestTracker");
const errorHandler = require("./middleware/errorHandler");

// =====================================================
// EXISTING ROUTES
// =====================================================

const signalRoutes = require("./routes/signalRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const escalationRoutes = require("./routes/escalationRoutes");
const replayRoutes = require("./routes/replayRoutes");
const evidenceRoutes = require("./routes/evidenceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const observabilityRoutes = require("./routes/observabilityRoutes");
const runtimeRoutes = require("./routes/runtimeRoutes");

// =====================================================
// TANTRA CONVERGENCE ROUTES
// =====================================================

const temporalRoutes = require("./routes/temporalRoutes");
const governanceRoutes = require("./routes/governanceRoutes");
const ingestionRoutes = require("./routes/ingestionRoutes");
const intelligenceRoutes = require("./routes/intelligenceRoutes");
const governanceConflictRoutes = require("./routes/governanceConflictRoutes");
const lifecycleRoutes = require("./routes/lifecycleRoutes");
const replayExecutionRoutes = require("./routes/replayExecutionRoutes");
const failureRoutes = require("./routes/failureRoutes");
const tantraFlowRoutes = require("./routes/tantraFlowRoutes");
const simulationRoutes = require("./routes/simulationRoutes");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

app.use(logger);
app.use(requestTracker);

// =====================================================
// STATIC FRONTEND
// =====================================================

app.use(express.static("frontend"));

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.json({
    application: "UCCIS Runtime Platform",
    platform: "UCCIS Tantra Convergence System",
    version: "1.0.0",
    runtimeHealth: "98%",
    status: "Healthy",
    traceId: req.traceId
  });
});

// =====================================================
// EXISTING ROUTES
// =====================================================

app.use("/api/signals", signalRoutes);

app.use("/api/telemetry", telemetryRoutes);

app.use("/api/incidents", incidentRoutes);

app.use("/api/escalations", escalationRoutes);

app.use("/api/replays", replayRoutes);

app.use("/api/evidence", evidenceRoutes);

app.use("/api/runtime", runtimeRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/observability", observabilityRoutes);

// =====================================================
// TANTRA CONVERGENCE ROUTES
// =====================================================

app.use("/temporal", temporalRoutes);

app.use("/api/governance", governanceRoutes);

app.use("/api/ingestion", ingestionRoutes);

app.use("/api/intelligence", intelligenceRoutes);

app.use("/api/governance-conflict", governanceConflictRoutes);

app.use("/api/lifecycle", lifecycleRoutes);

app.use("/api/replay-execution", replayExecutionRoutes);

app.use("/api/failure-engine", failureRoutes);

app.use("/api/tantra-flow", tantraFlowRoutes);

app.use("/api/run-simulation", simulationRoutes);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found"
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(errorHandler);

// =====================================================
// EXPORT
// =====================================================

module.exports = app;