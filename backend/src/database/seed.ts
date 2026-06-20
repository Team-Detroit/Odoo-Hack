// Seed script placeholder
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  // Add minimal seed data if helpful for frontend devs
  // await prisma.user.create({ data: { email: 'admin@odoo-cafe.test', password: 'changeme' } });
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
