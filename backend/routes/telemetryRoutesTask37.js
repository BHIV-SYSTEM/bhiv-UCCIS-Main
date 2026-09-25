const express =
require("express");

const router =
express.Router();

const {
getTelemetry
} = require(
"../controllers/telemetryControllerTask37"
);

router.get(
"/",
getTelemetry
);

module.exports = router;