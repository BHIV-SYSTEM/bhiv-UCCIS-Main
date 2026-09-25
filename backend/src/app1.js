const express = require("express");
const cors = require("cors");

const logger =
  require("./middleware/logger");

const traceMiddleware =
  require("./middleware/traceMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use(logger);
app.use(traceMiddleware);

module.exports = app;