const db = require('../config/db');

const create = async ({ customer_id, ip_address, browser, device, country }) => {
  await db.query(
    `INSERT INTO scan_logs (customer_id, ip_address, browser, device, country)
     VALUES ($1, $2, $3, $4, $5)`,
    [customer_id, ip_address, browser, device, country]
  );
};

const findByCustomer = async (customerId, limit = 50) => {
  const { rows } = await db.query(
    `SELECT * FROM scan_logs WHERE customer_id = $1
     ORDER BY scanned_at DESC LIMIT $2`,
    [customerId, limit]
  );
  return rows;
};

const findAll = async ({ limit = 50, offset = 0 }) => {
  const { rows } = await db.query(
    `SELECT sl.*, c.full_name, c.slug
     FROM scan_logs sl
     JOIN customers c ON c.id = sl.customer_id
     ORDER BY sl.scanned_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
};

const countAll = async () => {
  const { rows } = await db.query('SELECT COUNT(*) FROM scan_logs');
  return parseInt(rows[0].count);
};

module.exports = { create, findByCustomer, findAll, countAll };
