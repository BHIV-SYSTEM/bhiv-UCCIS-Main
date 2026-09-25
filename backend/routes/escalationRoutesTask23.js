const express = require("express"); 
const router = express.Router(); 

const { getEscalations } = require("../controllers/escalationControllerTask23"); 

router.get("/", getEscalations); 

module.exports = router;