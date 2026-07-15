const express = require('express');
const router = express.Router();
const { getAllSocialLinks, upsertSocialLink, deleteSocialLink } = require('../controllers/socialLinkController');
const { requireAuth } = require('../middleware/auth');

router.get('/', getAllSocialLinks);
router.post('/', requireAuth, upsertSocialLink);
router.delete('/:id', requireAuth, deleteSocialLink);

module.exports = router;
