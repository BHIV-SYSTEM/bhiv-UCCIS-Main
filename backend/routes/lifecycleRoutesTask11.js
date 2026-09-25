const express = require("express");

const router = express.Router();

const lifecycleController = require(
  "../controllers/lifecycleController"
);

router.get(
  "/:trace_id",
  lifecycleController.getLifecycle
);

router.get(
  "/validate/:trace_id",
  lifecycleController.validateLifecycle
);

router.get(
  "/reconstruct/:trace_id",
  lifecycleController.reconstructLifecycle
);

module.exports = router;