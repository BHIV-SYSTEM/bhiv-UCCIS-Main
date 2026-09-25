const incidentService =
require("./incident.service");

exports.createIncident =
async (req, res) => {
  const incident =
  await incidentService.create(
    req.body
  );

  res.status(201).json(incident);
};

exports.getIncidents =
async (req, res) => {
  const data =
  await incidentService.findAll();

  res.json(data);
};