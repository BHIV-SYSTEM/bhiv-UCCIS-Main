const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const operationalController = require(
  "../controllers/operationalController"
);

router.get(
  "/run",

  authMiddleware,

  roleMiddleware("ADMIN"),

  operationalController.runSimulation
);

module.exports = router;