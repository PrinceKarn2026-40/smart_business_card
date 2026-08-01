const db = require('../config/db');

const findByCustomer = async (customerId) => {
  const { rows } = await db.query(
    'SELECT * FROM social_links WHERE customer_id = $1 ORDER BY id',
    [customerId]
  );
  return rows;
};

const replaceAll = async (customerId, links) => {
  await db.query('DELETE FROM social_links WHERE customer_id = $1', [customerId]);

  if (!links || links.length === 0) return;

  const values = links
    .filter(l => l.platform && l.url)
    .map((l, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`)
    .join(', ');

  if (!values) return;

  const params = [customerId];
  links.filter(l => l.platform && l.url).forEach(l => {
    params.push(l.platform, l.url);
  });

  await db.query(
    `INSERT INTO social_links (customer_id, platform, url) VALUES ${values}`,
    params
  );
};

module.exports = { findByCustomer, replaceAll };
