require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file before seeding');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists — skipping user creation.`);
  } else {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, password: hashed } });
    console.log(`Created admin user: ${email}`);
  }

  const settings = await prisma.settings.findFirst();
  if (!settings) {
    await prisma.settings.create({ data: {} });
    console.log('Created default settings row.');
  } else {
    console.log('Settings row already exists — skipping.');
  }

  // A few default categories to start with
  const defaultCategories = [
    'Graphic Design', 'Branding', 'Logo Design', 'Social Media', 'Posters', 'Video Editing', 'Motion Graphics',
  ];
  const slugify = require('slugify');
  for (const name of defaultCategories) {
    const slug = slugify(name, { lower: true, strict: true });
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }
  console.log('Default categories ensured.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
