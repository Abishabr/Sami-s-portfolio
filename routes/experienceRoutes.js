const express = require('express');
const router = express.Router();
const { getAllExperiences, createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController');
const { requireAuth } = require('../middleware/auth');

router.get('/', getAllExperiences);
router.post('/', requireAuth, createExperience);
router.put('/:id', requireAuth, updateExperience);
router.delete('/:id', requireAuth, deleteExperience);

module.exports = router;
