const express =
require("express");

const router =
express.Router();

const healthService =
require(
  "../api/health/health.service"
);

router.get(
  "/",
  async (req, res) => {

    const result =
      await healthService.getHealth();

    res.json(result);

  }
);

module.exports =
router;