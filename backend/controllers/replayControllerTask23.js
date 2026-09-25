const replay = require("../database/mockData/replayEvents.json"); 

const getReplayEvents = async (req, res) => { 
    res.json(replay); 
}; 

module.exports = { getReplayEvents };