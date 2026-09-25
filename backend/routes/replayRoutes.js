const express = require("express");
const router = express.Router();

const { getHistory } = require("../memory/stateHistory");

router.get("/:zone_id", (req, res) => {
    const zoneId = req.params.zone_id.toLowerCase();

    const replay = getHistory(zoneId);

    if (!replay || replay.length === 0) {
        return res.status(404).json({
            success: false,
            message: `No replay history found for ${zoneId}`,
            replay: []
        });
    }

    res.json({
        success: true,
        zone_id: zoneId,
        replay
    });
});

module.exports = router;