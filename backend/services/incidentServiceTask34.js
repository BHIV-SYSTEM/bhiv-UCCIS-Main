const { task34DB } = require("../config/db");

exports.getIncidents = async () => {
  return {
    totalIncidents: 10,
    openIncidents: 4,
    resolvedIncidents: 6
  };
};

exports.createIncident = async (data) => {
  return {
    message: "Incident Created",
    incident: data
  };
};