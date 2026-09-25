const express = require("express");
const router = express.Router();
const controller = require("../controllers/traceController");

router.get("/", controller.getAllTraces);
router.get("/:trace_id", controller.getTraceById);

module.exports = router;