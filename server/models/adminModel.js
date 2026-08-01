const db = require('../config/db');

const findByUsername = async (username) => {
  const { rows } = await db.query(
    'SELECT * FROM admins WHERE username = $1',
    [username]
  );
  return rows[0] || null;
};

const findById = async (id) => {
  const { rows } = await db.query(
    'SELECT id, username, created_at FROM admins WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

module.exports = { findByUsername, findById };
