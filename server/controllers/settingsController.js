const bcrypt = require('bcrypt');
const db = require('../config/db');

const updateUsername = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters' });
    }

    // Check if username already taken
    const { rows } = await db.query(
      'SELECT id FROM admins WHERE username = $1 AND id != $2',
      [username.trim(), req.admin.id]
    );
    if (rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    await db.query(
      'UPDATE admins SET username = $1, updated_at = NOW() WHERE id = $2',
      [username.trim(), req.admin.id]
    );

    res.json({ success: true, message: 'Username updated successfully' });
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const { rows } = await db.query('SELECT password_hash FROM admins WHERE id = $1', [req.admin.id]);
    const valid = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const hash = await bcrypt.hash(new_password, 12);
    await db.query(
      'UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hash, req.admin.id]
    );

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { updateUsername, updatePassword };
