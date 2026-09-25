const express = require("express");
const router = express.Router();

const { getAllSnapshots, getSnapshotByTrace } = require("../controllers/snapshotController");

router.get("/snapshots", getAllSnapshots);
router.get("/snapshots/:trace_id", getSnapshotByTrace);

module.exports = router;