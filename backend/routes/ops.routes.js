const router = require("express").Router();

router.get("/status", (req, res) => {
  res.json({
    incidents: 12,
    tasks: 248,
    escalations: 3
  });
});

module.exports = router;