import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({ adapter });
async function main() {
  const customers = Array.from({ length: 1000 }).map((_, i) => ({
    first_name: `Customer${i}`,
    last_name: `Test${i}`,
    email: `customer${i}@example.com`,
    tax_exempt: false,
    created_at: new Date(),
  }));

  await prisma.customer.createMany({
    data: customers,
    skipDuplicates: true,
  });

  await prisma.paymentMethod.createMany({
    data: [{ name: 'Cash' }, { name: 'Card' }, { name: 'Bank Transfer' }],
  });

  console.log('Seeded successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
