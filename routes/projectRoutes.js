const express = require('express');
const router = express.Router();
const {
  getAllProjects, getProjectBySlug, createProject, updateProject,
  deleteProject, deleteProjectImage, toggleFeatured, reorderFeatured,
} = require('../controllers/projectController');
const { requireAuth } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

const projectUploads = uploadImage.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 },
  { name: 'gallery', maxCount: 20 },
]);

// Public
router.get('/', getAllProjects);
router.get('/:slug', getProjectBySlug);

// Admin (protected)
router.post('/', requireAuth, projectUploads, createProject);
router.put('/:id', requireAuth, projectUploads, updateProject);
router.delete('/:id', requireAuth, deleteProject);
router.delete('/images/:imageId', requireAuth, deleteProjectImage);
router.patch('/:id/featured', requireAuth, toggleFeatured);
router.post('/featured/reorder', requireAuth, reorderFeatured);

module.exports = router;
