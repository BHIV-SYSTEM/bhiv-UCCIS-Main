const express =
require("express");

const router =
express.Router();

const {
getObservability
} = require(
"../controllers/observabilityControllerTask37"
);

router.get(
"/",
getObservability
);

module.exports = router;