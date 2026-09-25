const express =
require("express");

const router =
express.Router();

const {
getRuntime
} = require(
"../controllers/runtimeControllerTask37"
);

router.get(
"/",
getRuntime
);

module.exports = router;