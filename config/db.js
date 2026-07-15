const { PrismaClient } = require('@prisma/client');

// Reuse a single Prisma Client instance across the app
const prisma = new PrismaClient();

module.exports = prisma;
