const express =
require("express");

const router =
express.Router();

const runtimeService =
require("../services/runtimeService");

router.post(
  "/execute",
  async (req, res) => {

    try {

      const result =
        await runtimeService.execute(
          req.body
        );

      res.status(200).json({
        success: true,
        ...result
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);

module.exports = router;