const authService = require('../services/authService');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const result = await authService.login(username, password);

    res.json({ success: true, token: result.token, admin: result.admin });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { login, logout };
