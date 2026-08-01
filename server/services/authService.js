const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');

const login = async (username, password) => {
  const admin = await adminModel.findByUsername(username);
  if (!admin) throw { status: 401, message: 'Invalid username or password' };

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) throw { status: 401, message: 'Invalid username or password' };

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token, admin: { id: admin.id, username: admin.username } };
};

module.exports = { login };
