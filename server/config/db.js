const { Pool } = require('pg');

const isExternal = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: (process.env.NODE_ENV === 'production' || isExternal) ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  process.exit(-1);
});

const query = (text, params) => pool.query(text, params);

module.exports = { query, pool };
