const dashboardModel = require('../models/dashboardModel');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardModel.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
