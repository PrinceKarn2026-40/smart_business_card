const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/customers', require('./customerRoutes'));
router.use('/scans', require('./scanRoutes'));
router.use('/settings', require('./settingsRoutes'));

module.exports = router;
