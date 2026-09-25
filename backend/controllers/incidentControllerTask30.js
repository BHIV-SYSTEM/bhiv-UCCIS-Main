const IncidentTask30 = require("../models/IncidentTask30");

exports.getIncidents = async (req, res) => {
  try {

    const [rows] = await IncidentTask30.getAll();

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};