const scanLogModel = require('../models/scanLogModel');
const db = require('../config/db');

const getAll = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    const [scans, total] = await Promise.all([
      scanLogModel.findAll({ limit, offset }),
      scanLogModel.countAll(),
    ]);

    // Extra stats
    const [todayRes, weekRes, deviceRes, browserRes] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM scan_logs WHERE scanned_at >= NOW() - INTERVAL '1 day'`),
      db.query(`SELECT COUNT(*) FROM scan_logs WHERE scanned_at >= NOW() - INTERVAL '7 days'`),
      db.query(`SELECT device, COUNT(*) as count FROM scan_logs GROUP BY device ORDER BY count DESC`),
      db.query(`SELECT browser, COUNT(*) as count FROM scan_logs GROUP BY browser ORDER BY count DESC`),
    ]);

    res.json({
      success: true,
      scans,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      stats: {
        today: parseInt(todayRes.rows[0].count),
        thisWeek: parseInt(weekRes.rows[0].count),
        byDevice: deviceRes.rows,
        byBrowser: browserRes.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll };
