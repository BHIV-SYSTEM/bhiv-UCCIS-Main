exports.getEscalation = async (req, res) => {
  res.json({
    level: "HIGH",
    district: "Pune",
    activeCases: 9
  });
};