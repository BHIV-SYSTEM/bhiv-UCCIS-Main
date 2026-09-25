const express = require("express"); 
const router = express.Router(); 

const { getReplayEvents } = require("../controllers/replayControllerTask23"); 

router.get("/", getReplayEvents); 

module.exports = router;