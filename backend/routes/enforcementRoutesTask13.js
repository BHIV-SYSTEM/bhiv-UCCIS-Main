import express from "express";

import { runEnforcementPipeline } from "../enforcement/enforcementPipeline.js";
import { validateEnforcementContinuity } from "../enforcement/continuityValidator.js";

const router = express.Router();

router.get("/", (req, res) => {

  const log = runEnforcementPipeline();
  const validation = validateEnforcementContinuity();

  res.json({
    success: true,
    log,
    validation
  });

});

export default router;