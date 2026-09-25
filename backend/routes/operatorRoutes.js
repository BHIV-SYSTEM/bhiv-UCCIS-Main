const express = require("express"); 
const router = express.Router(); 

const { getOperators } = require("../controllers/operatorController"); 

router.get("/", getOperators); 

module.exports = router;