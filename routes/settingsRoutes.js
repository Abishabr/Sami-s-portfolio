const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, updateResume, getDashboardStats } = require('../controllers/settingsController');
const { requireAuth } = require('../middleware/auth');
const { uploadImage, uploadDocument } = require('../middleware/upload');

const settingsUploads = uploadImage.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 },
  { name: 'profilePicture', maxCount: 1 },
]);

router.get('/', getSettings);
router.put('/', requireAuth, settingsUploads, updateSettings);
router.put('/resume', requireAuth, uploadDocument.single('resume'), updateResume);
router.get('/dashboard-stats', requireAuth, getDashboardStats);

module.exports = router;
