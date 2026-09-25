const express = require("express");

const {
  runFieldLifecycle,
} = require("../field/fieldLifecycleEngine");

const {
  computeFieldAging,
} = require("../field/agingEngine");

const router = express.Router();

router.get("/", (req, res) => {

  const lifecycle = runFieldLifecycle();

  const aging = computeFieldAging();

  res.json({
    success: true,
    lifecycle,
    aging,
  });

});

module.exports = router;