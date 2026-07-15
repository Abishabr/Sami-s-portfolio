const prisma = require('../config/db');

async function getAllServices(req, res) {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
}

async function createService(req, res) {
  try {
    const { name, description, icon, order } = req.body;
    if (!name || !description) return res.status(400).json({ error: 'Name and description are required' });

    const service = await prisma.service.create({
      data: { name, description, icon: icon || null, order: order ? Number(order) : 0 },
    });
    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create service' });
  }
}

async function updateService(req, res) {
  try {
    const { name, description, icon, order } = req.body;
    const data = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (icon !== undefined) data.icon = icon;
    if (order !== undefined) data.order = Number(order);

    const service = await prisma.service.update({ where: { id: req.params.id }, data });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update service' });
  }
}

async function deleteService(req, res) {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete service' });
  }
}

module.exports = { getAllServices, createService, updateService, deleteService };
