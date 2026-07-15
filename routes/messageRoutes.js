const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { createMessage, getAllMessages, markAsRead, deleteMessage } = require('../controllers/messageController');
const { requireAuth } = require('../middleware/auth');

// Prevent contact form spam/abuse
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many messages sent. Please try again later.' },
});

// Public
router.post('/', contactLimiter, createMessage);

// Admin
router.get('/', requireAuth, getAllMessages);
router.patch('/:id/read', requireAuth, markAsRead);
router.delete('/:id', requireAuth, deleteMessage);

module.exports = router;
