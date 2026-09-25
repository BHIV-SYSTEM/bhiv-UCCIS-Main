import express from "express";

import { generateReplayTimeline } from "../services/replayEngine.js";

const router = express.Router();

router.get("/", (req, res) => {

  const replay = generateReplayTimeline();

  res.json({
    success: true,
    replay
  });

});

export default router;