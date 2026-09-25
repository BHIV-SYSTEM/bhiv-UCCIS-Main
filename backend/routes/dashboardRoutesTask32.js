const express = require("express");
const router = express.Router();

const {
  getDashboard
} = require("../controllers/dashboardControllerTask32");

router.get(
  "/dashboard",
  getDashboard
);

module.exports = router;