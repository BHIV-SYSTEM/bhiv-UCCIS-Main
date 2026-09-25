const escalations = require("../database/mockData/escalations.json"); 

const getEscalations = async (req, res) => { 
    res.json(escalations); 
}; 

module.exports = { getEscalations };