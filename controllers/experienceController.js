const prisma = require('../config/db');

async function getAllExperiences(req, res) {
  try {
    const experiences = await prisma.experience.findMany({ orderBy: { startDate: 'desc' } });
    res.json(experiences);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
}

async function createExperience(req, res) {
  try {
    const { company, position, description, startDate, endDate, order } = req.body;
    if (!company || !position || !startDate) {
      return res.status(400).json({ error: 'Company, position, and start date are required' });
    }

    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        description: description || '',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        order: order ? Number(order) : 0,
      },
    });
    res.status(201).json(experience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create experience' });
  }
}

async function updateExperience(req, res) {
  try {
    const { company, position, description, startDate, endDate, order } = req.body;
    const data = {};
    if (company) data.company = company;
    if (position) data.position = position;
    if (description !== undefined) data.description = description;
    if (startDate) data.startDate = new Date(startDate);
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;
    if (order !== undefined) data.order = Number(order);

    const experience = await prisma.experience.update({ where: { id: req.params.id }, data });
    res.json(experience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update experience' });
  }
}

async function deleteExperience(req, res) {
  try {
    await prisma.experience.delete({ where: { id: req.params.id } });
    res.json({ message: 'Experience deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
}

module.exports = { getAllExperiences, createExperience, updateExperience, deleteExperience };
