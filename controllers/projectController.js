const slugify = require('slugify');
const prisma = require('../config/db');

async function getAllProjects(req, res) {
  try {
    const { category, search, featured } = req.query;
    const where = {};

    if (category) where.category = { slug: category };
    if (featured === 'true') where.isFeatured = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { client: { contains: search, mode: 'insensitive' } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: { category: true, images: { orderBy: { order: 'asc' } } },
      orderBy: [{ featuredOrder: 'asc' }, { createdAt: 'desc' }],
    });

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

async function getProjectBySlug(req, res) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      include: { category: true, images: { orderBy: { order: 'asc' } } },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
}

async function createProject(req, res) {
  try {
    const {
      title, description, client, projectDate, technologies,
      categoryId, videoUrl, creativeProcess, challenges, finalResult,
    } = req.body;

    if (!title || !description || !categoryId) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        client: client || null,
        projectDate: projectDate ? new Date(projectDate) : null,
        technologies: technologies ? JSON.parse(technologies) : [],
        categoryId,
        videoUrl: videoUrl || null,
        creativeProcess: creativeProcess || null,
        challenges: challenges || null,
        finalResult: finalResult || null,
        coverImage: req.files?.coverImage?.[0]?.path || null,
        bannerImage: req.files?.bannerImage?.[0]?.path || null,
      },
    });

    // Handle gallery images if provided
    if (req.files?.gallery?.length) {
      await prisma.projectImage.createMany({
        data: req.files.gallery.map((file, i) => ({
          url: file.path,
          projectId: project.id,
          order: i,
        })),
      });
    }

    const fullProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: { category: true, images: true },
    });

    res.status(201).json(fullProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create project' });
  }
}

async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const {
      title, description, client, projectDate, technologies,
      categoryId, videoUrl, creativeProcess, challenges, finalResult,
    } = req.body;

    const data = {};
    if (title) { data.title = title; data.slug = slugify(title, { lower: true, strict: true }); }
    if (description) data.description = description;
    if (client !== undefined) data.client = client;
    if (projectDate) data.projectDate = new Date(projectDate);
    if (technologies) data.technologies = JSON.parse(technologies);
    if (categoryId) data.categoryId = categoryId;
    if (videoUrl !== undefined) data.videoUrl = videoUrl;
    if (creativeProcess !== undefined) data.creativeProcess = creativeProcess;
    if (challenges !== undefined) data.challenges = challenges;
    if (finalResult !== undefined) data.finalResult = finalResult;
    if (req.files?.coverImage?.[0]) data.coverImage = req.files.coverImage[0].path;
    if (req.files?.bannerImage?.[0]) data.bannerImage = req.files.bannerImage[0].path;

    const project = await prisma.project.update({ where: { id }, data });

    if (req.files?.gallery?.length) {
      const existingCount = await prisma.projectImage.count({ where: { projectId: id } });
      await prisma.projectImage.createMany({
        data: req.files.gallery.map((file, i) => ({
          url: file.path,
          projectId: id,
          order: existingCount + i,
        })),
      });
    }

    const fullProject = await prisma.project.findUnique({
      where: { id },
      include: { category: true, images: { orderBy: { order: 'asc' } } },
    });

    res.json(fullProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update project' });
  }
}

async function deleteProject(req, res) {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
}

async function deleteProjectImage(req, res) {
  try {
    await prisma.projectImage.delete({ where: { id: req.params.imageId } });
    res.json({ message: 'Image deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
}

async function toggleFeatured(req, res) {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const updated = await prisma.project.update({
      where: { id },
      data: {
        isFeatured: !project.isFeatured,
        featuredOrder: !project.isFeatured ? await getNextFeaturedOrder() : null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle featured status' });
  }
}

async function getNextFeaturedOrder() {
  const count = await prisma.project.count({ where: { isFeatured: true } });
  return count;
}

async function reorderFeatured(req, res) {
  try {
    const { order } = req.body; // array of project ids in desired order
    await Promise.all(
      order.map((id, index) =>
        prisma.project.update({ where: { id }, data: { featuredOrder: index } })
      )
    );
    res.json({ message: 'Featured order updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reorder featured projects' });
  }
}

module.exports = {
  getAllProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  deleteProjectImage,
  toggleFeatured,
  reorderFeatured,
};
