const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { protect } = require('../middleware/auth');
const upload = require('../config/multer');

const photoUpload = upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'cover_photo', maxCount: 1 },
]);

router.get('/', protect, customerController.getAll);
router.get('/:id', protect, customerController.getOne);
router.post('/', protect, photoUpload, customerController.create);
router.put('/:id', protect, photoUpload, customerController.update);
router.delete('/:id', protect, customerController.remove);

module.exports = router;
