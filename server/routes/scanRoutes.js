const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const { protect } = require('../middleware/auth');

router.get('/', protect, scanController.getAll);

module.exports = router;
