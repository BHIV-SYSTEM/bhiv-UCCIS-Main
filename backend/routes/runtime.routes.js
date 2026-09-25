const express =
  require("express");

const router =
  express.Router();

const RuntimeEngine =
  require(
    "../runtime/RuntimeEngine"
  );

router.post(
  "/start",
  (req, res) => {
    const runtime =
      RuntimeEngine.createRuntimeSignal(
        req.body
      );

    res.status(201).json(
      runtime
    );
  }
);

router.get(
  "/events",
  (req, res) => {
    res.json(
      RuntimeEngine.getAllRuntimeEvents()
    );
  }
);

router.get(
  "/health",
  (req, res) => {
    res.json(
      RuntimeEngine.getRuntimeHealth()
    );
  }
);

module.exports =
  router;