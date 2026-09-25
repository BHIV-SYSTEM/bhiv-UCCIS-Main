const express = require("express");
const router = express.Router();

const db = require("../database/db");

router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM decisions ORDER BY id DESC",
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
});

router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM decisions WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
});

module.exports = router;