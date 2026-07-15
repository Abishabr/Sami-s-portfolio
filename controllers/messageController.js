const prisma = require('../config/db');

// Public: submit a contact form message
async function createMessage(req, res) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const newMessage = await prisma.message.create({
      data: { name, email, subject: subject || null, message },
    });

    res.status(201).json({ message: 'Message sent successfully', id: newMessage.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

// Admin: list all messages, with optional search
async function getAllMessages(req, res) {
  try {
    const { search, unreadOnly } = req.query;
    const where = {};
    if (unreadOnly === 'true') where.isRead = false;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const messages = await prisma.message.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

async function markAsRead(req, res) {
  try {
    const message = await prisma.message.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
}

async function deleteMessage(req, res) {
  try {
    await prisma.message.delete({ where: { id: req.params.id } });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
}

module.exports = { createMessage, getAllMessages, markAsRead, deleteMessage };
