const express = require('express');
const router = express.Router();
const { updateUsername, updatePassword } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.put('/username', protect, updateUsername);
router.put('/password', protect, updatePassword);

module.exports = router;
