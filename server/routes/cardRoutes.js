const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.get('/:slug', cardController.getCard);

module.exports = router;
