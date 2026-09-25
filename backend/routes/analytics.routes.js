const express =
  require("express");

const router =
  express.Router();

const analyticsController =
  require(
    "../modules/analytics/analytics.controller"
  );

router.get(
  "/dashboard",
  analyticsController.dashboardStats
);

module.exports =
  router;