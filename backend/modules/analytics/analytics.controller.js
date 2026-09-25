const analyticsService =
  require("./analytics.service");

exports.dashboardStats =
  async (req, res) => {
    const stats =
      await analyticsService.dashboardStats();

    res.json(stats);
  };