const prisma = require('../config/db');

// There is always exactly one settings row. Create it if missing, then return it.
async function getOrCreateSettings() {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }
  return settings;
}

async function getSettings(req, res) {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
}

async function updateSettings(req, res) {
  try {
    const settings = await getOrCreateSettings();
    const {
      websiteTitle, themeColor, footerText, seoTitle, seoDescription, seoKeywords,
      biography, heroText, yearsExperience, projectsCompleted, happyClients,
    } = req.body;

    const data = {};
    if (websiteTitle !== undefined) data.websiteTitle = websiteTitle;
    if (themeColor !== undefined) data.themeColor = themeColor;
    if (footerText !== undefined) data.footerText = footerText;
    if (seoTitle !== undefined) data.seoTitle = seoTitle;
    if (seoDescription !== undefined) data.seoDescription = seoDescription;
    if (seoKeywords !== undefined) data.seoKeywords = seoKeywords;
    if (biography !== undefined) data.biography = biography;
    if (heroText !== undefined) data.heroText = heroText;
    if (yearsExperience !== undefined) data.yearsExperience = Number(yearsExperience);
    if (projectsCompleted !== undefined) data.projectsCompleted = Number(projectsCompleted);
    if (happyClients !== undefined) data.happyClients = Number(happyClients);

    if (req.files?.logo?.[0]) data.logo = req.files.logo[0].path;
    if (req.files?.favicon?.[0]) data.favicon = req.files.favicon[0].path;
    if (req.files?.profilePicture?.[0]) data.profilePicture = req.files.profilePicture[0].path;

    const updated = await prisma.settings.update({ where: { id: settings.id }, data });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
}

// Resume upload uses a separate endpoint because it needs Cloudinary's "raw" resource
// type (PDF/doc), while logo/favicon/profilePicture use the "image" resource type.
async function updateResume(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const settings = await getOrCreateSettings();
    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: { resumeUrl: req.file.path },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
}

// Dashboard stats
async function getDashboardStats(req, res) {
  try {
    const [totalProjects, featuredProjects, totalServices, totalSkills, totalMessages, unreadMessages, recentProjects, recentMessages] =
      await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { isFeatured: true } }),
        prisma.service.count(),
        prisma.skill.count(),
        prisma.message.count(),
        prisma.message.count({ where: { isRead: false } }),
        prisma.project.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { category: true } }),
        prisma.message.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
      ]);

    res.json({
      stats: { totalProjects, featuredProjects, totalServices, totalSkills, totalMessages, unreadMessages },
      recentProjects,
      recentMessages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}

module.exports = { getSettings, updateSettings, updateResume, getDashboardStats };
