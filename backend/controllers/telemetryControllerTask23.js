const telemetry = require("../database/mockData/telemetry.json"); 

const getTelemetry = async (req, res) => { 
    res.json(telemetry); 
}; 

module.exports = { getTelemetry };