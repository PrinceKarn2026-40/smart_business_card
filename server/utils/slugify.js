const db = require('../config/db');

const generateSlug = async (fullName) => {
  const base = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  let slug = base;
  let count = 1;

  while (true) {
    const { rows } = await db.query('SELECT id FROM customers WHERE slug = $1', [slug]);
    if (rows.length === 0) break;
    slug = `${base}-${count++}`;
  }

  return slug;
};

module.exports = { generateSlug };
