const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  db.all("SELECT * FROM incidents", [], (err, rows) => {
    res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { title, severity, status } = req.body;

  db.run(
    "INSERT INTO incidents(title,severity,status) VALUES(?,?,?)",
    [title, severity, status],
    function () {
      res.json({
        success: true,
        id: this.lastID,
      });
    }
  );
});

module.exports = router;