const slugify = require('slugify');
const prisma = require('../config/db');

async function getAllCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { projects: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

async function createCategory(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const slug = slugify(name, { lower: true, strict: true });
    const category = await prisma.category.create({ data: { name, slug } });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') return res.status(409).json({ error: 'Category already exists' });
    res.status(500).json({ error: 'Failed to create category' });
  }
}

async function updateCategory(req, res) {
  try {
    const { name } = req.body;
    const data = {};
    if (name) { data.name = name; data.slug = slugify(name, { lower: true, strict: true }); }

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data,
    });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update category' });
  }
}

async function deleteCategory(req, res) {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2003') {
      return res.status(409).json({ error: 'Cannot delete category with existing projects' });
    }
    res.status(500).json({ error: 'Failed to delete category' });
  }
}

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
