const prisma = require('../config/db');

async function getAllSocialLinks(req, res) {
  try {
    const links = await prisma.socialLink.findMany();
    res.json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch social links' });
  }
}

// Upsert: create or update a platform's URL in one call
async function upsertSocialLink(req, res) {
  try {
    const { platform, url } = req.body;
    if (!platform || !url) return res.status(400).json({ error: 'Platform and url are required' });

    const link = await prisma.socialLink.upsert({
      where: { platform },
      update: { url },
      create: { platform, url },
    });
    res.json(link);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save social link' });
  }
}

async function deleteSocialLink(req, res) {
  try {
    await prisma.socialLink.delete({ where: { id: req.params.id } });
    res.json({ message: 'Social link deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete social link' });
  }
}

module.exports = { getAllSocialLinks, upsertSocialLink, deleteSocialLink };
