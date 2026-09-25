const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.json({
    totalEvidence: 32,
    verifiedEvidence: 24,
    pendingEvidence: 8
  });

});

router.get("/list", (req, res) => {

  res.json([
    {
      id: 1,
      trace_id: "TRACE-6001",
      evidence_name: "Flood Zone Image",
      type: "IMAGE",
      status: "VERIFIED"
    },
    {
      id: 2,
      trace_id: "TRACE-6002",
      evidence_name: "Traffic Camera Video",
      type: "VIDEO",
      status: "VERIFIED"
    },
    {
      id: 3,
      trace_id: "TRACE-6003",
      evidence_name: "Power Failure Report",
      type: "DOCUMENT",
      status: "PENDING"
    }
  ]);

});

module.exports = router;