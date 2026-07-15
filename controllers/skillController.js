const prisma = require('../config/db');

async function getAllSkills(req, res) {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
}

async function createSkill(req, res) {
  try {
    const { name, percentage, icon, order } = req.body;
    if (!name || percentage === undefined) {
      return res.status(400).json({ error: 'Name and percentage are required' });
    }
    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({ error: 'Percentage must be between 0 and 100' });
    }

    const skill = await prisma.skill.create({
      data: { name, percentage: Number(percentage), icon: icon || null, order: order ? Number(order) : 0 },
    });
    res.status(201).json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create skill' });
  }
}

async function updateSkill(req, res) {
  try {
    const { name, percentage, icon, order } = req.body;
    const data = {};
    if (name) data.name = name;
    if (percentage !== undefined) data.percentage = Number(percentage);
    if (icon !== undefined) data.icon = icon;
    if (order !== undefined) data.order = Number(order);

    const skill = await prisma.skill.update({ where: { id: req.params.id }, data });
    res.json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update skill' });
  }
}

async function deleteSkill(req, res) {
  try {
    await prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
}

module.exports = { getAllSkills, createSkill, updateSkill, deleteSkill };
