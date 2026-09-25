const express = require("express");

const {
  validateLineage,
} = require("../lineage/lineageValidator");

const router = express.Router();

router.get("/", (req, res) => {

  const result = validateLineage();

  res.json({
    success: true,
    lineage: result,
  });

});

module.exports = router;