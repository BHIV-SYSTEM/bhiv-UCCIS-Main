const express = require('express');
const router = express.Router();

const { getAISData, getAISStats } = require('../services/aisCsvService');

router.get('/stats', (req, res) => {
  try {
    res.json({
      success: true,
      source: 'AIS_file.csv',
      stats: getAISStats()
    });
  } catch (error) {
    console.error('AIS stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/', (req, res) => {
  try {
    const result = getAISData({
      limit: req.query.limit,
      offset: req.query.offset,
      mmsi: req.query.mmsi,
      vesselType: req.query.vesselType,
      from: req.query.from,
      to: req.query.to
    });

    res.json({
      success: true,
      source: 'AIS_file.csv',
      ...result
    });
  } catch (error) {
    console.error('AIS data error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
