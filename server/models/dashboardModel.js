const db = require('../config/db');

const getStats = async () => {
  const [customers, scans, recentCustomers, recentScans] = await Promise.all([
    db.query('SELECT COUNT(*) FROM customers'),
    db.query('SELECT COUNT(*) FROM scan_logs'),
    db.query('SELECT id, full_name, job_title, company, profile_photo, created_at FROM customers ORDER BY created_at DESC LIMIT 5'),
    db.query(`
      SELECT sl.id, sl.scanned_at, sl.device, sl.country,
             c.full_name, c.slug
      FROM scan_logs sl
      JOIN customers c ON c.id = sl.customer_id
      ORDER BY sl.scanned_at DESC LIMIT 5
    `),
  ]);

  return {
    totalCustomers: parseInt(customers.rows[0].count),
    totalScans: parseInt(scans.rows[0].count),
    recentCustomers: recentCustomers.rows,
    recentScans: recentScans.rows,
  };
};

module.exports = { getStats };
